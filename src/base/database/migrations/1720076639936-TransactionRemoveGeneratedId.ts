import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionRemoveGeneratedId1720076639936
  implements MigrationInterface
{
  name = 'TransactionRemoveGeneratedId1720076639936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "FK_fcc904addbe147f8ed2b1406c3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9"`,
    );
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "UQ_fcc904addbe147f8ed2b1406c3d"`,
    );
    await queryRunner.query(`ALTER TABLE "fines" DROP COLUMN "transaction_id"`);
    await queryRunner.query(
      `ALTER TABLE "fines" ADD "transaction_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "UQ_fcc904addbe147f8ed2b1406c3d" UNIQUE ("transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "FK_fcc904addbe147f8ed2b1406c3d" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "FK_fcc904addbe147f8ed2b1406c3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "UQ_fcc904addbe147f8ed2b1406c3d"`,
    );
    await queryRunner.query(`ALTER TABLE "fines" DROP COLUMN "transaction_id"`);
    await queryRunner.query(`ALTER TABLE "fines" ADD "transaction_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "UQ_fcc904addbe147f8ed2b1406c3d" UNIQUE ("transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9"`,
    );
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "FK_fcc904addbe147f8ed2b1406c3d" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
