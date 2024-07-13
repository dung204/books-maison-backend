import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransaction1720072293394 implements MigrationInterface {
  name = 'AddTransaction1720072293394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" money NOT NULL, "payment_method" character varying NOT NULL, "created_timestamp" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "fines" ADD "transaction_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "UQ_fcc904addbe147f8ed2b1406c3d" UNIQUE ("transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "UQ_fcc904addbe147f8ed2b1406c3d"`,
    );
    await queryRunner.query(`ALTER TABLE "fines" DROP COLUMN "transaction_id"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
  }
}
