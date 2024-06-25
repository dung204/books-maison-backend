import { MigrationInterface, QueryRunner } from 'typeorm';

export class CheckoutStatusDefaultValueToRenting1719282727203
  implements MigrationInterface
{
  name = 'CheckoutStatusDefaultValueToRenting1719282727203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "status" SET DEFAULT 'RENTING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkouts" ALTER COLUMN "status" DROP DEFAULT`,
    );
  }
}
