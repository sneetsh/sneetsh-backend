
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from "nestjs-seeder";
import { In, Repository } from "typeorm";

import roles from "./data";
import { Role } from "../../entities/role.entity";
import { Permission } from "../../entities/permission.entity";

@Injectable()
export class DefaultRoleSeeder implements Seeder {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {
  }

  async seed(): Promise<any> {
    for (let _role of roles) {
      const { permissionIds, ...roleData } = _role;

      let permissions = [];

      if (permissionIds.length) {
        permissions = await this.permissionRepository.find({ where: { id: In(permissionIds) } });
      }

      if (permissions.length) (roleData as any).permissions = permissions;

      let role = await this.roleRepository.findOneBy({ id: roleData.id });
      if (role) {
        Object.assign(role, roleData);
        await this.roleRepository.save(role);

        continue;
      }

      const newRole = this.roleRepository.create(roleData)
      await this.roleRepository.save(newRole);
    }
  }

  async drop(): Promise<any> {
    await this.roleRepository.delete(roles.map((role) => role.id));
  }
}
