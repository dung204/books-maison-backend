import { MigrationInterface, QueryRunner } from 'typeorm';

export class FineCreatedTimestamp1719757817187 implements MigrationInterface {
  name = 'FineCreatedTimestamp1719757817187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fines" ADD "created_timestamp" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fines" DROP COLUMN "created_timestamp"`,
    );
  }
}
