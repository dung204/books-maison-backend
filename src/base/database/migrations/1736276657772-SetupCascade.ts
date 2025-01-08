import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupCascade1736276657772 implements MigrationInterface {
  name = 'SetupCascade1736276657772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkouts" DROP CONSTRAINT "FK_24f9f28b7675d85d081881e32a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" DROP CONSTRAINT "FK_6cbe7c76cb72350febeb7e84985"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" DROP CONSTRAINT "FK_7ad4ff64d040552763834e13bc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD CONSTRAINT "FK_24f9f28b7675d85d081881e32a3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" ADD CONSTRAINT "FK_6cbe7c76cb72350febeb7e84985" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" ADD CONSTRAINT "FK_7ad4ff64d040552763834e13bc1" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favourite_books" DROP CONSTRAINT "FK_7ad4ff64d040552763834e13bc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" DROP CONSTRAINT "FK_6cbe7c76cb72350febeb7e84985"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" DROP CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" DROP CONSTRAINT "FK_24f9f28b7675d85d081881e32a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" ADD CONSTRAINT "FK_7ad4ff64d040552763834e13bc1" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourite_books" ADD CONSTRAINT "FK_6cbe7c76cb72350febeb7e84985" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fines" ADD CONSTRAINT "FK_6c2ddaeaf137b62a19e6e7518cd" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "checkouts" ADD CONSTRAINT "FK_24f9f28b7675d85d081881e32a3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
