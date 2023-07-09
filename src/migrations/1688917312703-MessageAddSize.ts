import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageAddSize1688917312703 implements MigrationInterface {
    name = 'MessageAddSize1688917312703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "size" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "size"`);
    }

}
