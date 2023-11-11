import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagsToSong1697948712900 implements MigrationInterface {
    name = 'AddTagsToSong1697948712900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "tags" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "tags"`);
    }

}
