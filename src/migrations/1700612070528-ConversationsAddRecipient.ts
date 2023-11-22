import { MigrationInterface, QueryRunner } from "typeorm";

export class ConversationsAddRecipient1700612070528 implements MigrationInterface {
    name = 'ConversationsAddRecipient1700612070528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" ADD "recipient_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "recipient" uuid`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_recipient_id" FOREIGN KEY ("recipient") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_recipient_id"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "recipient"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "recipient_id"`);
    }

}
