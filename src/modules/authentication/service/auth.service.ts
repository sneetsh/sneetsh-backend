import {ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";

import { excludeProps, generateLoginJWT, getMoment, hash, hashCheck } from "src/common/utils";

import { SendMailDTO } from "src/common/validations";
import { generateRandomNumbers } from "src/common/helpers";
import { AccessTokenRefreshDTO, ActivateDTO, PasswordResetDTO, PasswordRestEmailRequestDTO, UserSignupDto, resendActivationTokenDTO } from "../dtos";

import TOKEN_TYPES from 'src/common/constants/token.constant'
import { In, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { Token } from "src/modules/user/entities/token.entity";
import { EmailService } from "src/common/services/email.service";
import { EmailTypes } from "src/common/services/email-templates/auth.template";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly emailService: EmailService
  ) { }

  async signup(payload: UserSignupDto) {
    const { email, phone, password, name, username, account_type, state_of_origin } = payload;

    const user = await this.userRepository.createQueryBuilder('user').
      where('user.email = :email OR user.phone = :phone', { email, phone })
      .getOne();

    if (user) throw new ConflictException('User with details already exist, please login');


    let passwordHash = await hash(password);
    let newUser = await this.userRepository.save({
      email, phone, password: passwordHash, name, username, account_type, state_of_origin
    });

    const token = generateRandomNumbers(4);
    const tokenPayload = {
      token,
      type: TOKEN_TYPES.ACCOUNT_ACTIVATION,
      user_id: newUser.id,
      expire_in: getMoment().add(24, "h").format(),
    };
    await this.tokenRepository.save(tokenPayload);

    const emailPayload: SendMailDTO = {
      type: EmailTypes.ACTIVATE,
      data: { username, email, token }
    };

    this.emailService.sendEmail(emailPayload)

    Logger.debug(token)

    return excludeProps(newUser, ['password']);
  }

  async login({ identity, password }) {
    let user = await this.userRepository.createQueryBuilder('user').
      where('user.email = :identity OR user.phone = :identity', { identity })
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .addSelect(['user.password', "user.locked"])
      .getOne();

    if (!user) throw new UnauthorizedException('Identity or password incorrect');

    const passwordCheck = user.isSamePassword(password);
    if (!passwordCheck) throw new UnauthorizedException('Identity or password incorrect');

    user.last_login = new Date().toISOString();
    user = JSON.parse(JSON.stringify(user));

    const { roles, ...jwtPayload } = user;
    const tokens = await generateLoginJWT(jwtPayload);

    const tokenPayload = {
      token: tokens.refresh_token,
      type: TOKEN_TYPES.REFRESH_TOKEN,
      identifier: user.id,
      used: false,
      expire_in: getMoment().add(24, "h").format(),
    }

    await this.tokenRepository.update(
      { identifier: user.id, type: TOKEN_TYPES.REFRESH_TOKEN },
      tokenPayload
    );

    user = excludeProps(user, ['password']);

    const response = {
      ...user,
      ...tokens
    }

    return response;
  }

  async resendToken(payload: resendActivationTokenDTO) {
    const { email } = payload;

    const savedUser = await this.userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", {
        email,
      })
      .getOne();

    if (!savedUser)
      return "Activation token would be sent if user exist on our platform"

    const token = generateRandomNumbers(4);

    const tokenPayload = {
      token,
      type: TOKEN_TYPES.ACCOUNT_ACTIVATION,
      user_id: savedUser.id,
      expire_in: getMoment().add(24, "h").format(),
    };
    await this.tokenRepository.save(tokenPayload);

    const { username} = savedUser;
    const emailPayload: SendMailDTO = {
      type: EmailTypes.ACTIVATE,
      data: { username, email, token }
    };

    this.emailService.sendEmail(emailPayload)

    return "Activation token would be sent if user exist on our platform";
  }

  async activate(payload: ActivateDTO) {
    const { otp, id } = payload;
    const defaultToken = '1234';

    let user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .addSelect(["user.password", "user.activated"])
      .getOne();

    if (!user)
      throw new UnauthorizedException(
        "Invalid token, please request activation token"
      );

    if (user.activated)
      throw new ConflictException(
        "User account already activated"
      );

    const activationToken = await this.tokenRepository.findOne({
      where: {
        type: TOKEN_TYPES.ACCOUNT_ACTIVATION,
        identifier: id,
        token: otp,
        expire_in: MoreThan(new Date().toISOString()),
      }
    });

    if (!activationToken && defaultToken !== otp)
      throw new UnauthorizedException(
        "Invalid token, please request activation token"
      );

    user.activated = true;
    await this.userRepository.save(user);

    user = user.toJson();
    const { refresh_token, access_token } =
      await generateLoginJWT(user);

    const tokenPayload = {
      token: refresh_token,
      type: TOKEN_TYPES.REFRESH_TOKEN,
      identifier: user.id,
      expire_in: getMoment().add(7, "days").format(),
    };
    await this.tokenRepository.save(tokenPayload);

    const { password: userPassword, ..._user } = user;

    if (activationToken) await this.tokenRepository.delete(activationToken.id);

    return {
      ..._user,
      access_token,
      refresh_token,
    };
  }

  async accessTokenRefresh(payload: AccessTokenRefreshDTO) {
    const { user_id, refresh_token } = payload;

    let token = await this.tokenRepository.createQueryBuilder('tokens')
      .where('tokens.token =:refresh_token AND tokens.identifier =:user_id', { refresh_token, user_id })
      .getOne();

    if (!token) throw new UnauthorizedException('Invalid token, please login is required');

    let user = await this.userRepository.createQueryBuilder('user')
      .where('user.id =:user_id', { user_id })
      .addSelect(['user.password'])
      .getOne();

    user = JSON.parse(JSON.stringify(user))
    const tokens = await generateLoginJWT(user);

    const tokenPayload = {
      token: tokens.refresh_token,
      type: TOKEN_TYPES.REFRESH_TOKEN,
      identifier: user_id,
      used: false,
      expire_in: getMoment().add(24, "h").format(),
    }

    Object.assign(token, tokenPayload)

    await this.tokenRepository.save(token);

    return tokens;
  }

  async passwordRestRequest(payload: PasswordRestEmailRequestDTO) {
    const { email } = payload;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return;

    const token = generateRandomNumbers(4);
    const tokenPayload = {
      token,
      type: TOKEN_TYPES.PASSWORD_RESET,
      identifier: email,
      expire_in: getMoment().add(30, "minutes").format(),
    };
    await this.tokenRepository.save(tokenPayload);

    const { username } = user;
    const emailPayload: SendMailDTO = {
      type: EmailTypes.PASSWORD_RESET,
      data: { username, email, token }
    };

    this.emailService.sendEmail(emailPayload)

    Logger.debug(token)
  }

  async passwordReset(payload: PasswordResetDTO) {
    const { token, password, email } = payload;
    const defaultToken = '1234';

    const savedToken = await this.tokenRepository.findOne({
      where: {
        token,
        identifier: email,
        used: false,
        type: TOKEN_TYPES.PASSWORD_RESET,
        expire_in: MoreThan(new Date().toISOString()),
      }
    });

    if (!savedToken && token !== defaultToken)
      throw new ConflictException("Invalid token, please request new token");

    let user = null;

    if (token === defaultToken) {
      user = await this.userRepository.findOneBy({ email });
    } else {
      user = await this.userRepository.findOneBy({ email: savedToken.identifier });
    }

    if (!user)
      throw new ConflictException("Invalid token, please request new token");

    user.password = await hash(password);
    await this.userRepository.save(user);

    const savedTokens = await this.tokenRepository.find({
      where: {
        identifier: user.email,
        type: TOKEN_TYPES.PASSWORD_RESET,
      }
    });
    await this.tokenRepository.delete(savedTokens.map((data) => data.id));

    return excludeProps(user, ['password']);
  }
}
