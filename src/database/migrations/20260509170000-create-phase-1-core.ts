import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhase1Core20260509170000 implements MigrationInterface {
  name = 'CreatePhase1Core20260509170000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "party_type_enum" AS ENUM ('INDIVIDUAL', 'COMPANY')
    `);
    await queryRunner.query(`
      CREATE TYPE "vehicle_regime_enum" AS ENUM ('FEDERAL', 'ESTATAL')
    `);
    await queryRunner.query(`
      CREATE TYPE "vehicle_party_role_type_enum" AS ENUM (
        'CLIENT',
        'OWNER',
        'LEGAL_POSSESSOR',
        'PERMISSION_HOLDER',
        'CARD_HOLDER',
        'MANAGER',
        'RELATED'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "user_vehicle_access_type_enum" AS ENUM (
        'OWNER_PORTAL',
        'AUTHORIZED_PORTAL',
        'ADMIN_ASSIGNED'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "parties" (
        "id" BIGSERIAL NOT NULL,
        "party_type" "party_type_enum" NOT NULL,
        "rfc" character varying(13),
        "legal_name" character varying(255) NOT NULL,
        "display_name" character varying(255) NOT NULL,
        "phone" character varying(30),
        "email" character varying(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_parties_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_parties_rfc" UNIQUE ("rfc")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" BIGSERIAL NOT NULL,
        "party_id" bigint,
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255),
        "full_name" character varying(255) NOT NULL,
        "is_admin" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "last_login_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "vehicles" (
        "id" BIGSERIAL NOT NULL,
        "plate" character varying(20) NOT NULL,
        "serial_niv" character varying(100),
        "engine_number" character varying(100),
        "unit_type" character varying(100) NOT NULL,
        "regime" "vehicle_regime_enum" NOT NULL,
        "schedule_marker_auto" character(1) NOT NULL,
        "schedule_marker_override" character(1),
        "schedule_marker_effective" character(1) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_vehicles_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_vehicles_plate" UNIQUE ("plate"),
        CONSTRAINT "UQ_vehicles_serial_niv" UNIQUE ("serial_niv")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "vehicle_party_roles" (
        "id" BIGSERIAL NOT NULL,
        "vehicle_id" bigint NOT NULL,
        "party_id" bigint NOT NULL,
        "role_type" "vehicle_party_role_type_enum" NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date,
        "is_current" boolean NOT NULL DEFAULT true,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_vehicle_party_roles_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_vehicle_access" (
        "id" BIGSERIAL NOT NULL,
        "user_id" bigint NOT NULL,
        "vehicle_id" bigint NOT NULL,
        "access_type" "user_vehicle_access_type_enum" NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "granted_by_user_id" bigint,
        "granted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_vehicle_access_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_vehicle_access_user_vehicle" UNIQUE ("user_id", "vehicle_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_party_id" ON "users" ("party_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_vehicles_regime" ON "vehicles" ("regime")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_vehicles_schedule_marker_effective" ON "vehicles" ("schedule_marker_effective")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_vehicle_party_roles_vehicle_id" ON "vehicle_party_roles" ("vehicle_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_vehicle_party_roles_party_id" ON "vehicle_party_roles" ("party_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_vehicle_party_roles_role_type" ON "vehicle_party_roles" ("role_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_user_vehicle_access_vehicle_id" ON "user_vehicle_access" ("vehicle_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_user_vehicle_access_granted_by_user_id" ON "user_vehicle_access" ("granted_by_user_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "FK_users_party_id"
      FOREIGN KEY ("party_id")
      REFERENCES "parties"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "vehicle_party_roles"
      ADD CONSTRAINT "FK_vehicle_party_roles_vehicle_id"
      FOREIGN KEY ("vehicle_id")
      REFERENCES "vehicles"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "vehicle_party_roles"
      ADD CONSTRAINT "FK_vehicle_party_roles_party_id"
      FOREIGN KEY ("party_id")
      REFERENCES "parties"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_vehicle_access"
      ADD CONSTRAINT "FK_user_vehicle_access_user_id"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_vehicle_access"
      ADD CONSTRAINT "FK_user_vehicle_access_vehicle_id"
      FOREIGN KEY ("vehicle_id")
      REFERENCES "vehicles"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_vehicle_access"
      ADD CONSTRAINT "FK_user_vehicle_access_granted_by_user_id"
      FOREIGN KEY ("granted_by_user_id")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_vehicle_access"
      DROP CONSTRAINT "FK_user_vehicle_access_granted_by_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_vehicle_access"
      DROP CONSTRAINT "FK_user_vehicle_access_vehicle_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_vehicle_access"
      DROP CONSTRAINT "FK_user_vehicle_access_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "vehicle_party_roles"
      DROP CONSTRAINT "FK_vehicle_party_roles_party_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "vehicle_party_roles"
      DROP CONSTRAINT "FK_vehicle_party_roles_vehicle_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP CONSTRAINT "FK_users_party_id"
    `);

    await queryRunner.query(`DROP INDEX "IDX_user_vehicle_access_granted_by_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_user_vehicle_access_vehicle_id"`);
    await queryRunner.query(`DROP INDEX "IDX_vehicle_party_roles_role_type"`);
    await queryRunner.query(`DROP INDEX "IDX_vehicle_party_roles_party_id"`);
    await queryRunner.query(`DROP INDEX "IDX_vehicle_party_roles_vehicle_id"`);
    await queryRunner.query(`DROP INDEX "IDX_vehicles_schedule_marker_effective"`);
    await queryRunner.query(`DROP INDEX "IDX_vehicles_regime"`);
    await queryRunner.query(`DROP INDEX "IDX_users_party_id"`);

    await queryRunner.query(`DROP TABLE "user_vehicle_access"`);
    await queryRunner.query(`DROP TABLE "vehicle_party_roles"`);
    await queryRunner.query(`DROP TABLE "vehicles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "parties"`);

    await queryRunner.query(`DROP TYPE "user_vehicle_access_type_enum"`);
    await queryRunner.query(`DROP TYPE "vehicle_party_role_type_enum"`);
    await queryRunner.query(`DROP TYPE "vehicle_regime_enum"`);
    await queryRunner.query(`DROP TYPE "party_type_enum"`);
  }
}
