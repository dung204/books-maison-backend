import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookTitleNotNullQuantityDefaultZero1717378660658
  implements MigrationInterface
{
  name = 'BookTitleNotNullQuantityDefaultZero1717378660658';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "title" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "quantity" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "quantity" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "title" DROP NOT NULL`,
    );
  }
}
