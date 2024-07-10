import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllEntitiesAddCreatedTimestamp1720592746454
  implements MigrationInterface
{
  name = 'AllEntitiesAddCreatedTimestamp1720592746454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkouts" RENAME COLUMN "checkout_timestamp" TO "created_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "authors" ADD "created_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "created_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD "created_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" DROP COLUMN "created_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "created_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "authors" DROP COLUMN "created_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" RENAME COLUMN "created_timestamp" TO "checkout_timestamp"`,
    );
  }
}
