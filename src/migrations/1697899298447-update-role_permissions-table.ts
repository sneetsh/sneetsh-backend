import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRolePermissionsTable1697899298447 implements MigrationInterface {
    name = 'UpdateRolePermissionsTable1697899298447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_22cfa7cd3cf619a03fda9961e06"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_58ff21a58854a7efb0d8248f560"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22cfa7cd3cf619a03fda9961e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58ff21a58854a7efb0d8248f56"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "PK_52a097dad3afa7a64757014e617"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "PK_58ff21a58854a7efb0d8248f560" PRIMARY KEY ("permissionId")`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "PK_58ff21a58854a7efb0d8248f560"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP COLUMN "permissionId"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD "role_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "PK_47a354e630607052e998d362679" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD "permission_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "PK_47a354e630607052e998d362679"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "PK_a675e3a82a6810f3eccaa9253a9" PRIMARY KEY ("role_id", "permission_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_47a354e630607052e998d36267" ON "roles_permission" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6146087c365cb4328a2d651ff9" ON "roles_permission" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_47a354e630607052e998d362679" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_6146087c365cb4328a2d651ff91" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_6146087c365cb4328a2d651ff91"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_47a354e630607052e998d362679"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6146087c365cb4328a2d651ff9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47a354e630607052e998d36267"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "PK_a675e3a82a6810f3eccaa9253a9"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "PK_47a354e630607052e998d362679" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP COLUMN "permission_id"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "PK_47a354e630607052e998d362679"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD "permissionId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "PK_58ff21a58854a7efb0d8248f560" PRIMARY KEY ("permissionId")`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD "roleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "PK_58ff21a58854a7efb0d8248f560"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "PK_52a097dad3afa7a64757014e617" PRIMARY KEY ("roleId", "permissionId")`);
        await queryRunner.query(`CREATE INDEX "IDX_58ff21a58854a7efb0d8248f56" ON "roles_permission" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_22cfa7cd3cf619a03fda9961e0" ON "roles_permission" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_58ff21a58854a7efb0d8248f560" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_22cfa7cd3cf619a03fda9961e06" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
