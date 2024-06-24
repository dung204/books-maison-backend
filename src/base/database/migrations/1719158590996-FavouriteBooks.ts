import { MigrationInterface, QueryRunner } from 'typeorm';

export class FavouriteBooks1719158590996 implements MigrationInterface {
  name = 'FavouriteBooks1719158590996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b71e325ca0eb49bf3c151588ff"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5df315ddf16249a3ce3f70902b"`,
    );
    await queryRunner.query(`DROP TABLE "user_favourite_books"`);
    await queryRunner.query(
      `CREATE TABLE "favourite_books" ("user_id" uuid NOT NULL, "book_id" uuid NOT NULL, CONSTRAINT "PK_268d869ed02adc4619db2698dc4" PRIMARY KEY ("user_id", "book_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" ADD CONSTRAINT "FK_6cbe7c76cb72350febeb7e84985" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" ADD CONSTRAINT "FK_7ad4ff64d040552763834e13bc1" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_favourite_books" ("users_id" uuid NOT NULL, "books_id" uuid NOT NULL, CONSTRAINT "PK_4e046944b0bfdcb47d0bf3fc554" PRIMARY KEY ("users_id", "books_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5df315ddf16249a3ce3f70902b" ON "user_favourite_books" ("users_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b71e325ca0eb49bf3c151588ff" ON "user_favourite_books" ("books_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" DROP CONSTRAINT "FK_7ad4ff64d040552763834e13bc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" DROP CONSTRAINT "FK_6cbe7c76cb72350febeb7e84985"`,
    );
    await queryRunner.query(`DROP TABLE "favourite_books"`);
  }
}
