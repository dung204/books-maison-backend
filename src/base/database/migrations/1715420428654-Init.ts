import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1715420428654 implements MigrationInterface {
  name = 'Init1715420428654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "authors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "year_of_birth" integer, "year_of_death" integer, "nationality" character varying(100), "image_url" character varying(256), "biography" text, CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isbn" character varying(20), "title" character varying(256), "published_year" integer, "publisher" character varying(100), "language" character varying(100), "number_of_pages" integer, "image_url" character varying(256), "description" text, "quantity" integer NOT NULL, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "address" character varying(256), "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "created_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."checkouts_status_enum" AS ENUM('RENTING', 'OVERDUE', 'RETURNED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "checkouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "checkout_timestamp" TIMESTAMP WITH TIME ZONE DEFAULT now(), "due_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."checkouts_status_enum" NOT NULL, "user_id" uuid, "book_id" uuid, CONSTRAINT "PK_5800730d89f4137fc18770e4d4d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "checkout_id" uuid, CONSTRAINT "REL_6c2ddaeaf137b62a19e6e7518c" UNIQUE ("checkout_id"), CONSTRAINT "PK_b706344bc8943ab7a88ed5d312e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "books_categories_categories" ("books_id" uuid NOT NULL, "categories_id" uuid NOT NULL, CONSTRAINT "PK_b640e1bb751792ae96f53ee96e5" PRIMARY KEY ("books_id", "categories_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b098a6c8c0f9ba275c092e3d19" ON "books_categories_categories" ("books_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_104d1f331bd4599cc360da86ba" ON "books_categories_categories" ("categories_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "books_authors_authors" ("books_id" uuid NOT NULL, "authors_id" uuid NOT NULL, CONSTRAINT "PK_e14a4d217fc06cd1a633175bbaf" PRIMARY KEY ("books_id", "authors_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_37c605ccf5f840822f326b201a" ON "books_authors_authors" ("books_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93bcaac89caa9e03d068ed5396" ON "books_authors_authors" ("authors_id") `,
    );
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
      `ALTER TABLE "checkouts" ADD CONSTRAINT "FK_24f9f28b7675d85d081881e32a3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD CONSTRAINT "FK_0641dc7cec5dda2760b69888d82" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "books_categories_categories" ADD CONSTRAINT "FK_b098a6c8c0f9ba275c092e3d196" FOREIGN KEY ("books_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "books_categories_categories" ADD CONSTRAINT "FK_104d1f331bd4599cc360da86ba5" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "books_authors_authors" ADD CONSTRAINT "FK_37c605ccf5f840822f326b201a0" FOREIGN KEY ("books_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "books_authors_authors" ADD CONSTRAINT "FK_93bcaac89caa9e03d068ed5396e" FOREIGN KEY ("authors_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favourite_books" ADD CONSTRAINT "FK_5df315ddf16249a3ce3f70902b0" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favourite_books" ADD CONSTRAINT "FK_b71e325ca0eb49bf3c151588ffe" FOREIGN KEY ("books_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_favourite_books" DROP CONSTRAINT "FK_b71e325ca0eb49bf3c151588ffe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favourite_books" DROP CONSTRAINT "FK_5df315ddf16249a3ce3f70902b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books_authors_authors" DROP CONSTRAINT "FK_93bcaac89caa9e03d068ed5396e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books_authors_authors" DROP CONSTRAINT "FK_37c605ccf5f840822f326b201a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books_categories_categories" DROP CONSTRAINT "FK_104d1f331bd4599cc360da86ba5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books_categories_categories" DROP CONSTRAINT "FK_b098a6c8c0f9ba275c092e3d196"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" DROP CONSTRAINT "FK_0641dc7cec5dda2760b69888d82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" DROP CONSTRAINT "FK_24f9f28b7675d85d081881e32a3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b71e325ca0eb49bf3c151588ff"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5df315ddf16249a3ce3f70902b"`,
    );
    await queryRunner.query(`DROP TABLE "user_favourite_books"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_93bcaac89caa9e03d068ed5396"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_37c605ccf5f840822f326b201a"`,
    );
    await queryRunner.query(`DROP TABLE "books_authors_authors"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_104d1f331bd4599cc360da86ba"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b098a6c8c0f9ba275c092e3d19"`,
    );
    await queryRunner.query(`DROP TABLE "books_categories_categories"`);
    await queryRunner.query(`DROP TABLE "fines"`);
    await queryRunner.query(`DROP TABLE "checkouts"`);
    await queryRunner.query(`DROP TYPE "public"."checkouts_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "books"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "authors"`);
  }
}
