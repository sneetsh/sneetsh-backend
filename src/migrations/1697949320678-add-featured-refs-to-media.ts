import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeaturedRefsToMedia1697949320678 implements MigrationInterface {
    name = 'AddFeaturedRefsToMedia1697949320678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "feature_refs" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "feature_refs"`);
    }

}
