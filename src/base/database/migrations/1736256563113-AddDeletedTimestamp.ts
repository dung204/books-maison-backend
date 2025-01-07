import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedTimestamp1736256563113 implements MigrationInterface {
  name = 'AddDeletedTimestamp1736256563113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "deleted_timestamp" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "authors" ADD "deleted_timestamp" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "deleted_timestamp" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD "deleted_timestamp" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "deleted_timestamp" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD "deleted_timestamp" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD "deleted_timestamp" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "created_timestamp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "created_timestamp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ALTER COLUMN "created_timestamp" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fines" ALTER COLUMN "created_timestamp" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "created_timestamp" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "created_timestamp" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP COLUMN "deleted_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" DROP COLUMN "deleted_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "deleted_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" DROP COLUMN "deleted_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "deleted_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "authors" DROP COLUMN "deleted_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "deleted_timestamp"`,
    );
  }
}
