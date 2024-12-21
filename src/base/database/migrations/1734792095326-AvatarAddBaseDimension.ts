import { MigrationInterface, QueryRunner } from 'typeorm';

export class AvatarAddBaseDimension1734792095326 implements MigrationInterface {
  name = 'AvatarAddBaseDimension1734792095326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "avatars" ADD "base_dimension" numeric NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "avatars" DROP COLUMN "base_dimension"`,
    );
  }
}
