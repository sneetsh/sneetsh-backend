import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishStatus1697950119746 implements MigrationInterface {
    name = 'AddPublishStatus1697950119746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "status" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "status"`);
    }

}
