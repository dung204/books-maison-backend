import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionAmountUseInteger1720526487297
  implements MigrationInterface
{
  name = 'TransactionAmountUseInteger1720526487297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "amount" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "amount" money NOT NULL`,
    );
  }
}
