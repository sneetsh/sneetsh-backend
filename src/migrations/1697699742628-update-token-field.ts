import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTokenField1697699742628 implements MigrationInterface {
    name = 'UpdateTokenField1697699742628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" RENAME COLUMN "user_id" TO "identifier"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "identifier"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "identifier" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "identifier"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "identifier" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" RENAME COLUMN "identifier" TO "user_id"`);
    }

}
