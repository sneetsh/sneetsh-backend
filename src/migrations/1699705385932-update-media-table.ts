import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMediaTable1699705385932 implements MigrationInterface {
    name = 'UpdateMediaTable1699705385932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" RENAME COLUMN "url" TO "file"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" RENAME COLUMN "file" TO "url"`);
    }

}
