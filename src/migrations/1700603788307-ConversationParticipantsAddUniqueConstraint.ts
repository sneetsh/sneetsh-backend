import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConversationParticipantsAddUniqueConstraint1700603788307
  implements MigrationInterface
{
  name = 'ConversationParticipantsAddUniqueConstraint1700603788307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "UQ_user_id_conversation_id" UNIQUE ("user_id", "conversation_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "UQ_user_id_conversation_id"`,
    );
  }
}
