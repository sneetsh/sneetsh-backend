
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from "nestjs-seeder";
import { Repository } from "typeorm";

import permissions from "./data";
import { Permission } from "../../entities/permission.entity";

@Injectable()
export class DefaultPermissionSeeder implements Seeder {
  private logger = null;

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {
    this.logger = new Logger("PERMISSION_SEEDER");
  }

  async seed(): Promise<any> {
    for (let permission of permissions) {
      await this.permissionRepository.upsert(permission, ['id'])
    }

    this.logger.log("Permission(s) seeded successfully");
  }

  async drop(): Promise<any> {
    await this.permissionRepository.delete(permissions.map((permission) => permission.id));
  }
}
