import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediaStats1697948108223 implements MigrationInterface {
    name = 'AddMediaStats1697948108223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "duration" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media" ADD "favorite_count" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media" ADD "download_count" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "download_count"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "favorite_count"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "duration"`);
    }

}
