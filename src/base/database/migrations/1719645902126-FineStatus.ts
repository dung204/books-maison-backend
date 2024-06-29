import { MigrationInterface, QueryRunner } from 'typeorm';

export class FineStatus1719645902126 implements MigrationInterface {
  name = 'FineStatus1719645902126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fines" ADD "status" character varying NOT NULL DEFAULT 'ISSUED'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "fines" DROP COLUMN "status"`);
  }
}
