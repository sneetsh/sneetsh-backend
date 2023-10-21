import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMediaTable1697899586934 implements MigrationInterface {
    name = 'UpdateMediaTable1697899586934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."media_type_enum" AS ENUM('song', 'beat')`);
        await queryRunner.query(`ALTER TABLE "media" ADD "type" "public"."media_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."media_type_enum"`);
    }

}
