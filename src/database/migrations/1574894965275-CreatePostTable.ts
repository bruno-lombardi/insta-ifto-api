import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePostTable1574894965275 implements MigrationInterface {
    name = 'CreatePostTable1574894965275'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_641d5484bf75b063fdcff26abcd"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_ffcab6228b173c7b9dfb8c61244"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_4a44b6228b173c7b9dfb8aa647"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8844abvvbf75b01affffvc6112"`, undefined);
        await queryRunner.query(`CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "aspectRatio" numeric(8,3) NOT NULL, "content" character varying(1024), "image" character varying(1024) NOT NULL, "imageSmall" character varying(1024), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `, undefined);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`, undefined);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7"`, undefined);
        await queryRunner.query(`DROP TABLE "post"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8844abvvbf75b01affffvc6112" ON "user_roles_role" ("roleId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_4a44b6228b173c7b9dfb8aa647" ON "user_roles_role" ("userId") `, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_ffcab6228b173c7b9dfb8c61244" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_641d5484bf75b063fdcff26abcd" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

}
