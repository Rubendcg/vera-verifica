import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhase2Verifications20260509195500
  implements MigrationInterface
{
  name = 'CreatePhase2Verifications20260509195500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "verification_type_enum" AS ENUM (
        'PHYSICAL_MECHANICAL',
        'EMISSIONS'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "verification_result_status_enum" AS ENUM (
        'PASSED',
        'FAILED',
        'CONDITIONAL',
        'CANCELLED'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "verification_centers" (
        "id" BIGSERIAL NOT NULL,
        "center_type" character varying(50) NOT NULL,
        "code" character varying(30) NOT NULL,
        "name" character varying(255) NOT NULL,
        "state_code" character varying(10),
        "city" character varying(120),
        "address_line" character varying(255),
        "contact_name" character varying(255),
        "phone" character varying(30),
        "email" character varying(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_verification_centers_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_verification_centers_code" UNIQUE ("code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "verification_schedule_rules" (
        "id" BIGSERIAL NOT NULL,
        "regime" "vehicle_regime_enum" NOT NULL,
        "schedule_position" smallint NOT NULL,
        "schedule_marker" character(1) NOT NULL,
        "verification_type" "verification_type_enum" NOT NULL,
        "window_start_month" smallint NOT NULL,
        "window_end_month" smallint NOT NULL,
        "window_label" character varying(50) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_verification_schedule_rules_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_verification_schedule_rules_scope" UNIQUE (
          "regime",
          "schedule_position",
          "schedule_marker",
          "verification_type"
        ),
        CONSTRAINT "CHK_verification_schedule_rules_window_start_month" CHECK ("window_start_month" BETWEEN 1 AND 12),
        CONSTRAINT "CHK_verification_schedule_rules_window_end_month" CHECK ("window_end_month" BETWEEN 1 AND 12),
        CONSTRAINT "CHK_verification_schedule_rules_schedule_position" CHECK ("schedule_position" BETWEEN 1 AND 10)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "verification_events" (
        "id" BIGSERIAL NOT NULL,
        "vehicle_id" bigint NOT NULL,
        "center_id" bigint,
        "verification_type" "verification_type_enum" NOT NULL,
        "event_date" date NOT NULL,
        "valid_until" date NOT NULL,
        "result_status" "verification_result_status_enum" NOT NULL DEFAULT 'PASSED',
        "certificate_folio" character varying(100),
        "observations" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_verification_events_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_verification_centers_center_type" ON "verification_centers" ("center_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_centers_is_active" ON "verification_centers" ("is_active")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_schedule_rules_regime" ON "verification_schedule_rules" ("regime")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_schedule_rules_type" ON "verification_schedule_rules" ("verification_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_schedule_rules_is_active" ON "verification_schedule_rules" ("is_active")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_events_vehicle_id" ON "verification_events" ("vehicle_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_events_center_id" ON "verification_events" ("center_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_events_type" ON "verification_events" ("verification_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_events_valid_until" ON "verification_events" ("valid_until")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_events_result_status" ON "verification_events" ("result_status")
    `);

    await queryRunner.query(`
      ALTER TABLE "verification_events"
      ADD CONSTRAINT "FK_verification_events_vehicle_id"
      FOREIGN KEY ("vehicle_id")
      REFERENCES "vehicles"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_events"
      ADD CONSTRAINT "FK_verification_events_center_id"
      FOREIGN KEY ("center_id")
      REFERENCES "verification_centers"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "verification_events"
      DROP CONSTRAINT "FK_verification_events_center_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_events"
      DROP CONSTRAINT "FK_verification_events_vehicle_id"
    `);

    await queryRunner.query(`DROP INDEX "IDX_verification_events_result_status"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_events_valid_until"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_events_type"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_events_center_id"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_events_vehicle_id"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_schedule_rules_is_active"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_schedule_rules_type"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_schedule_rules_regime"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_centers_is_active"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_centers_center_type"`);

    await queryRunner.query(`DROP TABLE "verification_events"`);
    await queryRunner.query(`DROP TABLE "verification_schedule_rules"`);
    await queryRunner.query(`DROP TABLE "verification_centers"`);

    await queryRunner.query(`DROP TYPE "verification_result_status_enum"`);
    await queryRunner.query(`DROP TYPE "verification_type_enum"`);
  }
}
