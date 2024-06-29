import { MigrationInterface, QueryRunner } from 'typeorm';

export class CheckoutAddNote1719389142828 implements MigrationInterface {
  name = 'CheckoutAddNote1719389142828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "checkouts" ADD "note" text`);
    await queryRunner.query(
      `ALTER TYPE "public"."checkouts_status_enum" RENAME TO "checkouts_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."checkouts_status_enum" AS ENUM('RENTING', 'OVERDUE', 'RETURNED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "status" TYPE "public"."checkouts_status_enum" USING "status"::"text"::"public"."checkouts_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "status" SET DEFAULT 'RENTING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."checkouts_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."checkouts_status_enum_old" AS ENUM('RENTING', 'OVERDUE', 'RETURNED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "status" TYPE "public"."checkouts_status_enum_old" USING "status"::"text"::"public"."checkouts_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "status" SET DEFAULT 'RENTING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."checkouts_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."checkouts_status_enum_old" RENAME TO "checkouts_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "checkouts" DROP COLUMN "note"`);
  }
}
