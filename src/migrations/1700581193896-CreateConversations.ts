import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversations1700581193896 implements MigrationInterface {
  name = 'CreateConversations1700581193896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."conversations_status_enum" AS ENUM('Requested', 'Accepted', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."conversations_convo_type_enum" AS ENUM('Direct Message', 'Group')`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "status" "public"."conversations_status_enum" NOT NULL DEFAULT 'Requested', "convo_type" "public"."conversations_convo_type_enum" NOT NULL DEFAULT 'Direct Message', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user" uuid, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id")); COMMENT ON COLUMN "conversations"."user_id" IS 'conversation''s initiator'`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_user_id" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(
      `DROP TYPE "public"."conversations_convo_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."conversations_status_enum"`);
  }
}
