import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedMedia1699706481137 implements MigrationInterface {
    name = 'UpdatedMedia1699706481137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "cover" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "tags" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "favorite_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "download_count" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "download_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "favorite_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "tags" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "cover" SET NOT NULL`);
    }

}
