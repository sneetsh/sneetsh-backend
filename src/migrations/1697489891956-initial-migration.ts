import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1697489891956 implements MigrationInterface {
    name = 'InitialMigration1697489891956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "type" character varying NOT NULL, "expire_in" TIMESTAMP NOT NULL, "user_id" uuid NOT NULL, "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "category" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_status_enum" AS ENUM('inactive', 'active')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "name_token" tsvector NOT NULL, "description" character varying, "description_token" tsvector, "status" "public"."role_status_enum" NOT NULL DEFAULT 'active', "member_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fc43cabcad2f79d756e368a5e5" ON "role" ("name_token") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f4792c022c4e6cca535ea406b" ON "role" ("description_token") `);
        await queryRunner.query(`CREATE TYPE "public"."user_account_type_enum" AS ENUM('artist', 'producer', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "username" character varying, "email" character varying NOT NULL, "phone" character varying NOT NULL, "profile_pic" character varying, "thumbnail" character varying, "account_type" "public"."user_account_type_enum", "gender" "public"."user_gender_enum", "state_of_origin" character varying, "address" character varying, "locked" boolean NOT NULL DEFAULT false, "activated" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "last_login" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles_permission" ("roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_52a097dad3afa7a64757014e617" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22cfa7cd3cf619a03fda9961e0" ON "roles_permission" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58ff21a58854a7efb0d8248f56" ON "roles_permission" ("permissionId") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_88481b0c4ed9ada47e9fdd67475" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_22cfa7cd3cf619a03fda9961e06" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_58ff21a58854a7efb0d8248f560" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_58ff21a58854a7efb0d8248f560"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_22cfa7cd3cf619a03fda9961e06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86033897c009fcca8b6505d6be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_472b25323af01488f1f66a06b6"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58ff21a58854a7efb0d8248f56"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22cfa7cd3cf619a03fda9961e0"`);
        await queryRunner.query(`DROP TABLE "roles_permission"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f4792c022c4e6cca535ea406b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc43cabcad2f79d756e368a5e5"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_status_enum"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "token"`);
    }

}
