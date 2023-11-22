import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversationParticipants1700581218449
  implements MigrationInterface
{
  name = 'CreateConversationParticipants1700581218449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "conversation_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "conversation_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user" uuid, "conversations" uuid, CONSTRAINT "PK_61b51428ad9453f5921369fbe94" PRIMARY KEY ("id")); COMMENT ON COLUMN "conversation_participants"."user_id" IS 'conversation''s initiator'`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_user_id" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_conversations_id" FOREIGN KEY ("conversations") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_conversations_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "conversation_participants"`);
  }
}
