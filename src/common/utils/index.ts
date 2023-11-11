import * as crypto from 'crypto';
import * as fs from 'fs';

import * as JWT from 'jsonwebtoken';
import { config } from 'dotenv'
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

import { EnvironmentVariables } from '../validations/environment.validations';
import * as moment from 'moment-timezone';
import { connectionSource } from '../../typeorm.config';

config();

const ENV = process.env as any as EnvironmentVariables;

export const excludeProps = (obj: any, excludedProps: string[]) => {
  if (!obj) return obj;

  const _obj = obj;
  excludedProps.forEach((key: string) => {
    _obj[key] = undefined;
  });

  return _obj;
};

export const compactObj = (obj: any) => {
  const _obj: any = {};

  Object.keys(obj).forEach(key => {
    if (obj[key]) _obj[key] = obj[key];
  });

  return _obj;
}

const validatePublicKey = async (public_key: string) => {

  const hash_pk = generatePrivateKey(public_key);

  if (hash_pk !== public_key) throw new UnauthorizedException('Access Denied');

  return true;
};

const decodeJWT = async (private_key: string, token: string) => {
  try {
    return JWT.verify(token, private_key);
  } catch (e) {
    throw new UnauthorizedException('invalid Token');
  }
};

const stripAuth = (token: string) => {
  if (token.startsWith('Bearer ')) token = token.slice(7, token.length);

  return token;
};

const decodeToken = <T>(token: string) => {
  const decoded: T = JWT.decode(token) as any as T;
  return decoded;
};

const generateLoginJWT = (
  user,
  time = null

) => {
  const jwtSecret = ENV.JWT_SECRET;
  const tokens: { access_token: string, refresh_token: string } = {} as any;
  const _time = time ?? '2h'

  tokens.access_token = JWT.sign(user, jwtSecret, { expiresIn: _time });
  tokens.refresh_token = JWT.sign({ id: user.id }, jwtSecret, { expiresIn: '24h' });

  return tokens;
};

const generatePrivateKey = (public_key: string) => {
  const privateKey = ENV.CRYPTO_SECRET;

  const envVar = ENV.NODE_ENV === 'development' ? 'DF_test_' : 'DF_test_'

  return envVar + crypto
    .createHmac('sha256', public_key)
    .update(privateKey)
    .digest('hex');
};

const getMoment = (date?: string) => {
  if (date) return moment.tz(date);
  return moment?.tz();
}

export const toTsVector = async (value: string) => {
  if (!value) return null;

  const [{ result }] = await connectionSource.query(
    `SELECT to_tsvector('english', $1) result`,
    [value]
  );

  return result;
}

export const toTsQuery = async (query: string) => {
  const [{ result }] = await connectionSource.query(
    `SELECT to_tsquery('english', $1) result`,
    [query.replace(/\s/g, '|')]
  );

  return result;
}

export const removeUnusedImage = async (imagePath = '') => {
  try {
    if (!imagePath) return;

    const fileExists = fs.existsSync(imagePath);
    if (!fileExists) return;

    await fs.promises.rm(imagePath);
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const hash = (planValue: string) => {
  return bcrypt.hash(planValue, 11);
}

export const hashCheck = (plain: string, hash: string): boolean => {
  return bcrypt.compareSync(plain, hash);
}

export const capitalizeFirstLetter = (word: string) => {
  if (typeof word !== 'string' || word.length === 0) return word;

  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const sentenceCase = (value) => {
  if (!value) return "";
  let wordArr = value.split(" ");
  return wordArr.map((value) => capitalizeFirstLetter(value)).join(" ");
};

export const getFileData = (file: Express.Multer.File) => {
  const originalname = file.originalname;
  const extStartPoint = originalname.lastIndexOf(".") - 1;
  const ext = originalname.slice((extStartPoint >>> 0) + 2);
  const filename = originalname.slice(0, extStartPoint + 1);

  return { ext, filename }
}

export {
  getMoment,
  validatePublicKey,
  decodeJWT,
  stripAuth,
  generatePrivateKey,
  generateLoginJWT,
  decodeToken
};
