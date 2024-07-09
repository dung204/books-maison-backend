import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionRenameColumnTransactionMethod1720076971500
  implements MigrationInterface
{
  name = 'TransactionRenameColumnTransactionMethod1720076971500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "payment_method" TO "transaction_method"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "transaction_method" TO "payment_method"`,
    );
  }
}
