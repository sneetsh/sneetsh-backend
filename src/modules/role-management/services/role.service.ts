import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CreateRoleDto, UpdateRoleDTO } from "../dtos";
import { AssignRoleDTO } from "../dtos/assign-role.dto";

import { Role } from "../entities/role.entity";
import { Permission } from "../entities/permission.entity";
import { User } from "../../user/entities/user.entity";

import { excludeProps, toTsQuery, toTsVector } from "src/common/utils";
import { PaginationDTO } from "src/common/dto";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async createRole(role: CreateRoleDto, user: User) {
    const { name, description, permissions } = role;

    const _role = await this.roleRepository.findOne({ where: { name } });
    if (_role)
      throw new ConflictException(`Role with name "${name}" already exists`);

    const newRole = this.roleRepository.create({
      name,
      description,
    });

    let rolePermissions = [];
    for (let i = 0; i < permissions.length; i++) {
      const permission = await this.permissionRepository.findOneBy(
        { id: permissions[i] }
      );

      if (!permission)
        throw new NotFoundException("Specified permission not found");

      rolePermissions.push(permission);
    }

    if (rolePermissions.length) newRole.permissions = rolePermissions;

    await this.roleRepository.save(newRole);

    return newRole;
  }

  async assignRole(payload: AssignRoleDTO) {
    const { user_id, role_ids } = payload;

    const user = await this.userRepository.findOne({ where: { id: user_id }, relations: ['roles'] });
    if (!user) throw new NotFoundException("Specified user not found");

    const userRoles = user.roles.map(role => role.id);
    const newRoles = role_ids.filter(roleId => !userRoles.includes(roleId))

    let roles = [];
    for (let role_id of newRoles) {

      const role = await this.roleRepository.findOneBy({ id: role_id });
      if (!role) throw new NotFoundException("Specified role not found");

      roles.push(role);
    }

    user.roles = [...user.roles, ...roles];
    await this.userRepository.save(user);

    return user;
  }

  async updatedRole(id: string, payload: UpdateRoleDTO) {
    const { permissions, ...updateData } = payload;
    let role = await this.roleRepository.findOneBy({ id });

    if (updateData.description) role.description_token = await toTsVector(updateData.description);
    if (updateData.name) role.name_token = await toTsVector(updateData.name);

    if (!role) throw new NotFoundException("Specified role not found");

    let _permissions = [];
    if (permissions?.length) {
      for (let id of permissions) {
        const permission = await this.permissionRepository.findOneBy({ id });
        if (!permission) throw new NotFoundException("Permission found");

        _permissions.push(permission);
      }
      role.permissions = _permissions;
    }

    Object.assign(role, updateData);

    await this.roleRepository.save(role);

    return excludeProps(role, ['description_token', 'name_token']);
  }

  async getPermission() {
    return this.permissionRepository.find();
  }

  async getRole(id: string) {

    const role = await this.roleRepository.findOne(
      { where: { id }, relations: ["permissions"] },
    );
    if (!role) throw new NotFoundException("Specified role not found");

    return role;
  }

  async getRoles(payload: PaginationDTO) {
    let { page = 0, limit = 100, search } = payload;

    const query = this.roleRepository
      .createQueryBuilder("role")
      .where('1=1')
      .leftJoinAndSelect("role.permissions", "permissions");

    if (search) {
      search = await toTsQuery(search)
      query.andWhere("role.name_token @@ :search OR role.description_token @@ :search", { search });
    }

    const [results, total] = await query
      .take(+limit)
      .skip(+page)
      .orderBy({ 'role.created_at': 'DESC' })
      .getManyAndCount();

    return {
      page,
      limit,
      total,
      results
    };
  }
}
