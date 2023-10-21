import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateMediaTables1697898449164 implements MigrationInterface {
    name = 'GenerateMediaTables1697898449164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "cover" character varying NOT NULL, "url" character varying NOT NULL, "label" character varying NOT NULL, "genre" character varying NOT NULL, "album" character varying, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "update_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_features" ("user_id" uuid NOT NULL, "media_id" uuid NOT NULL, CONSTRAINT "PK_d43df3814eb446f173e110066be" PRIMARY KEY ("user_id", "media_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_93ba05009b2885ad70d531958d" ON "user_features" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6639f3a08dd7e34caf80ca96fb" ON "user_features" ("media_id") `);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_c0dd13ee4ffc96e61bdc1fb592d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_features" ADD CONSTRAINT "FK_93ba05009b2885ad70d531958d3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_features" ADD CONSTRAINT "FK_6639f3a08dd7e34caf80ca96fba" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_features" DROP CONSTRAINT "FK_6639f3a08dd7e34caf80ca96fba"`);
        await queryRunner.query(`ALTER TABLE "user_features" DROP CONSTRAINT "FK_93ba05009b2885ad70d531958d3"`);
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_c0dd13ee4ffc96e61bdc1fb592d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6639f3a08dd7e34caf80ca96fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93ba05009b2885ad70d531958d"`);
        await queryRunner.query(`DROP TABLE "user_features"`);
        await queryRunner.query(`DROP TABLE "media"`);
    }

}
