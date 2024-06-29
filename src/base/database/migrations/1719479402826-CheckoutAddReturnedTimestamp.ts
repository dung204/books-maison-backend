import { MigrationInterface, QueryRunner } from 'typeorm';

export class CheckoutAddReturnedTimestamp1719479402826
  implements MigrationInterface
{
  name = 'CheckoutAddReturnedTimestamp1719479402826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD "returned_timestamp" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkouts" DROP COLUMN "returned_timestamp"`,
    );
  }
}
