import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAvatar1734512828902 implements MigrationInterface {
  name = 'CreateAvatar1734512828902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "avatars" ("id" character varying NOT NULL, "offset_x" numeric NOT NULL, "offset_y" numeric NOT NULL, "zoom" numeric NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "REL_068bfde144915dbef38bae3180" UNIQUE ("user_id"), CONSTRAINT "PK_224de7bae2014a1557cd9930ed7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_c3401836efedec3bec459c8f818" UNIQUE ("avatar_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "avatars" ADD CONSTRAINT "FK_068bfde144915dbef38bae31808" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "avatars"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "avatars" DROP CONSTRAINT "FK_068bfde144915dbef38bae31808"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_id"`);
    await queryRunner.query(`DROP TABLE "avatars"`);
  }
}
