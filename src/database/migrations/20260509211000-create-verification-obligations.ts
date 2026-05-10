import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVerificationObligations20260509211000
  implements MigrationInterface
{
  name = 'CreateVerificationObligations20260509211000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "verification_obligation_status_enum" AS ENUM (
        'PENDING',
        'OWNER_CONFIRMED',
        'OWNER_DECLINED',
        'REQUESTED_ASSISTANCE',
        'SCHEDULED',
        'COMPLETED',
        'OVERDUE',
        'CANCELLED'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "verification_owner_response_enum" AS ENUM (
        'CONFIRMED',
        'DECLINED',
        'REQUEST_ASSISTANCE',
        'REQUEST_RESCHEDULE'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "verification_obligation_history_action_type_enum" AS ENUM (
        'CREATED',
        'OWNER_RESPONSE',
        'ADMIN_UPDATED',
        'SCHEDULED',
        'COMPLETED',
        'CANCELLED',
        'SYSTEM_UPDATED'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "verification_obligations" (
        "id" BIGSERIAL NOT NULL,
        "vehicle_id" bigint NOT NULL,
        "verification_type" "verification_type_enum" NOT NULL,
        "due_date" date NOT NULL,
        "window_start_date" date NOT NULL,
        "window_end_date" date NOT NULL,
        "status" "verification_obligation_status_enum" NOT NULL DEFAULT 'PENDING',
        "owner_response" "verification_owner_response_enum",
        "owner_response_at" TIMESTAMPTZ,
        "owner_user_id" bigint,
        "admin_user_id" bigint,
        "scheduled_center_id" bigint,
        "scheduled_for" TIMESTAMPTZ,
        "verification_event_id" bigint,
        "closed_at" TIMESTAMPTZ,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_verification_obligations_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_verification_obligations_vehicle_type_due_date" UNIQUE (
          "vehicle_id",
          "verification_type",
          "due_date"
        ),
        CONSTRAINT "UQ_verification_obligations_verification_event_id" UNIQUE ("verification_event_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "verification_obligation_history" (
        "id" BIGSERIAL NOT NULL,
        "obligation_id" bigint NOT NULL,
        "changed_by_user_id" bigint,
        "action_type" "verification_obligation_history_action_type_enum" NOT NULL,
        "previous_status" "verification_obligation_status_enum",
        "new_status" "verification_obligation_status_enum" NOT NULL,
        "previous_owner_response" "verification_owner_response_enum",
        "new_owner_response" "verification_owner_response_enum",
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_verification_obligation_history_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligations_vehicle_id" ON "verification_obligations" ("vehicle_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligations_status" ON "verification_obligations" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligations_due_date" ON "verification_obligations" ("due_date")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligations_owner_user_id" ON "verification_obligations" ("owner_user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligations_admin_user_id" ON "verification_obligations" ("admin_user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligations_scheduled_center_id" ON "verification_obligations" ("scheduled_center_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligations_verification_type" ON "verification_obligations" ("verification_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligation_history_obligation_id" ON "verification_obligation_history" ("obligation_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligation_history_changed_by_user_id" ON "verification_obligation_history" ("changed_by_user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_obligation_history_action_type" ON "verification_obligation_history" ("action_type")
    `);

    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      ADD CONSTRAINT "FK_verification_obligations_vehicle_id"
      FOREIGN KEY ("vehicle_id")
      REFERENCES "vehicles"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      ADD CONSTRAINT "FK_verification_obligations_owner_user_id"
      FOREIGN KEY ("owner_user_id")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      ADD CONSTRAINT "FK_verification_obligations_admin_user_id"
      FOREIGN KEY ("admin_user_id")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      ADD CONSTRAINT "FK_verification_obligations_scheduled_center_id"
      FOREIGN KEY ("scheduled_center_id")
      REFERENCES "verification_centers"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      ADD CONSTRAINT "FK_verification_obligations_verification_event_id"
      FOREIGN KEY ("verification_event_id")
      REFERENCES "verification_events"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligation_history"
      ADD CONSTRAINT "FK_verification_obligation_history_obligation_id"
      FOREIGN KEY ("obligation_id")
      REFERENCES "verification_obligations"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligation_history"
      ADD CONSTRAINT "FK_verification_obligation_history_changed_by_user_id"
      FOREIGN KEY ("changed_by_user_id")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "verification_obligation_history"
      DROP CONSTRAINT "FK_verification_obligation_history_changed_by_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligation_history"
      DROP CONSTRAINT "FK_verification_obligation_history_obligation_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      DROP CONSTRAINT "FK_verification_obligations_verification_event_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      DROP CONSTRAINT "FK_verification_obligations_scheduled_center_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      DROP CONSTRAINT "FK_verification_obligations_admin_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      DROP CONSTRAINT "FK_verification_obligations_owner_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_obligations"
      DROP CONSTRAINT "FK_verification_obligations_vehicle_id"
    `);

    await queryRunner.query(`DROP INDEX "IDX_verification_obligation_history_action_type"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligation_history_changed_by_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligation_history_obligation_id"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligations_verification_type"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligations_scheduled_center_id"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligations_admin_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligations_owner_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligations_due_date"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligations_status"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_obligations_vehicle_id"`);

    await queryRunner.query(`DROP TABLE "verification_obligation_history"`);
    await queryRunner.query(`DROP TABLE "verification_obligations"`);

    await queryRunner.query(`DROP TYPE "verification_obligation_history_action_type_enum"`);
    await queryRunner.query(`DROP TYPE "verification_owner_response_enum"`);
    await queryRunner.query(`DROP TYPE "verification_obligation_status_enum"`);
  }
}
