import { MigrationInterface, QueryRunner } from 'typeorm';

export class CheckoutIdAndFineIdNoGeneratedUUID1722580363827
  implements MigrationInterface
{
  name = 'CheckoutIdAndFineIdNoGeneratedUUID1722580363827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" DROP CONSTRAINT "PK_5800730d89f4137fc18770e4d4d"`,
    );
    await queryRunner.query(`ALTER TABLE "checkouts" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD CONSTRAINT "PK_5800730d89f4137fc18770e4d4d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "PK_b706344bc8943ab7a88ed5d312e"`,
    );
    await queryRunner.query(`ALTER TABLE "fines" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "fines" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "PK_b706344bc8943ab7a88ed5d312e" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "REL_6c2ddaeaf137b62a19e6e7518c"`,
    );
    await queryRunner.query(`ALTER TABLE "fines" DROP COLUMN "checkout_id"`);
    await queryRunner.query(
      `ALTER TABLE "fines" ADD "checkout_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "UQ_6c2ddaeaf137b62a19e6e7518cd" UNIQUE ("checkout_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "UQ_6c2ddaeaf137b62a19e6e7518cd"`,
    );
    await queryRunner.query(`ALTER TABLE "fines" DROP COLUMN "checkout_id"`);
    await queryRunner.query(`ALTER TABLE "fines" ADD "checkout_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "REL_6c2ddaeaf137b62a19e6e7518c" UNIQUE ("checkout_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "PK_b706344bc8943ab7a88ed5d312e"`,
    );
    await queryRunner.query(`ALTER TABLE "fines" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "fines" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "PK_b706344bc8943ab7a88ed5d312e" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" DROP CONSTRAINT "PK_5800730d89f4137fc18770e4d4d"`,
    );
    await queryRunner.query(`ALTER TABLE "checkouts" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD CONSTRAINT "PK_5800730d89f4137fc18770e4d4d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
