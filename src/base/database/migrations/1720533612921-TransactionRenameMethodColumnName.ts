import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionRenameMethodColumnName1720533612921
  implements MigrationInterface
{
  name = 'TransactionRenameMethodColumnName1720533612921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "transaction_method" TO "method"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "method" TO "transaction_method"`,
    );
  }
}
