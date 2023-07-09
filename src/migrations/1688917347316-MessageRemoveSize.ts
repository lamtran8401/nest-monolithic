import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageRemoveSize1688917347316 implements MigrationInterface {
    name = 'MessageRemoveSize1688917347316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "size"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "size" integer NOT NULL DEFAULT '0'`);
    }

}
