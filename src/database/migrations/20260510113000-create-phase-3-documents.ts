import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhase3Documents20260510113000
  implements MigrationInterface
{
  name = 'CreatePhase3Documents20260510113000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "document_status_enum" AS ENUM (
        'ACTIVE',
        'EXPIRED',
        'CANCELLED',
        'ARCHIVED',
        'PENDING_REVIEW'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "document_storage_kind_enum" AS ENUM (
        'LOCAL_PATH',
        'OBJECT_STORAGE',
        'DATABASE'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "document_ocr_status_enum" AS ENUM (
        'NOT_REQUESTED',
        'PENDING',
        'COMPLETED',
        'FAILED'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "documents" (
        "id" BIGSERIAL NOT NULL,
        "vehicle_id" bigint NOT NULL,
        "related_party_id" bigint,
        "uploaded_by_user_id" bigint,
        "document_type" character varying(100) NOT NULL,
        "verification_type" "verification_type_enum",
        "document_number" character varying(100),
        "issue_date" date,
        "valid_until" date,
        "document_status" "document_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "is_visible_to_owner" boolean NOT NULL DEFAULT false,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_documents_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "document_files" (
        "id" BIGSERIAL NOT NULL,
        "document_id" bigint NOT NULL,
        "uploaded_by_user_id" bigint,
        "version_no" integer NOT NULL,
        "mime_type" character varying(100) NOT NULL,
        "original_file_name" character varying(255) NOT NULL,
        "storage_kind" "document_storage_kind_enum" NOT NULL DEFAULT 'LOCAL_PATH',
        "storage_path" character varying(500),
        "content_bytea" bytea,
        "file_size_bytes" bigint,
        "sha256_hex" character varying(64),
        "page_count" integer,
        "scanned_at" TIMESTAMPTZ,
        "ocr_status" "document_ocr_status_enum" NOT NULL DEFAULT 'NOT_REQUESTED',
        "ocr_text" text,
        "is_current" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_document_files_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_document_files_document_version" UNIQUE ("document_id", "version_no")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "verification_events"
      ADD COLUMN "source_document_id" bigint
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_documents_vehicle_id" ON "documents" ("vehicle_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_documents_related_party_id" ON "documents" ("related_party_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_documents_uploaded_by_user_id" ON "documents" ("uploaded_by_user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_documents_document_type" ON "documents" ("document_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_documents_verification_type" ON "documents" ("verification_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_documents_valid_until" ON "documents" ("valid_until")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_documents_document_status" ON "documents" ("document_status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_documents_is_visible_to_owner" ON "documents" ("is_visible_to_owner")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_document_files_document_id" ON "document_files" ("document_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_document_files_uploaded_by_user_id" ON "document_files" ("uploaded_by_user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_document_files_storage_kind" ON "document_files" ("storage_kind")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_document_files_sha256_hex" ON "document_files" ("sha256_hex")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_document_files_is_current" ON "document_files" ("is_current")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_document_files_current_per_document"
      ON "document_files" ("document_id")
      WHERE "is_current" = true
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_events_source_document_id" ON "verification_events" ("source_document_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "documents"
      ADD CONSTRAINT "FK_documents_vehicle_id"
      FOREIGN KEY ("vehicle_id")
      REFERENCES "vehicles"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "documents"
      ADD CONSTRAINT "FK_documents_related_party_id"
      FOREIGN KEY ("related_party_id")
      REFERENCES "parties"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "documents"
      ADD CONSTRAINT "FK_documents_uploaded_by_user_id"
      FOREIGN KEY ("uploaded_by_user_id")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "document_files"
      ADD CONSTRAINT "FK_document_files_document_id"
      FOREIGN KEY ("document_id")
      REFERENCES "documents"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "document_files"
      ADD CONSTRAINT "FK_document_files_uploaded_by_user_id"
      FOREIGN KEY ("uploaded_by_user_id")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_events"
      ADD CONSTRAINT "FK_verification_events_source_document_id"
      FOREIGN KEY ("source_document_id")
      REFERENCES "documents"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "verification_events"
      DROP CONSTRAINT "FK_verification_events_source_document_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "document_files"
      DROP CONSTRAINT "FK_document_files_uploaded_by_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "document_files"
      DROP CONSTRAINT "FK_document_files_document_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "documents"
      DROP CONSTRAINT "FK_documents_uploaded_by_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "documents"
      DROP CONSTRAINT "FK_documents_related_party_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "documents"
      DROP CONSTRAINT "FK_documents_vehicle_id"
    `);

    await queryRunner.query(`DROP INDEX "IDX_verification_events_source_document_id"`);
    await queryRunner.query(`DROP INDEX "UQ_document_files_current_per_document"`);
    await queryRunner.query(`DROP INDEX "IDX_document_files_is_current"`);
    await queryRunner.query(`DROP INDEX "IDX_document_files_sha256_hex"`);
    await queryRunner.query(`DROP INDEX "IDX_document_files_storage_kind"`);
    await queryRunner.query(`DROP INDEX "IDX_document_files_uploaded_by_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_document_files_document_id"`);
    await queryRunner.query(`DROP INDEX "IDX_documents_is_visible_to_owner"`);
    await queryRunner.query(`DROP INDEX "IDX_documents_document_status"`);
    await queryRunner.query(`DROP INDEX "IDX_documents_valid_until"`);
    await queryRunner.query(`DROP INDEX "IDX_documents_verification_type"`);
    await queryRunner.query(`DROP INDEX "IDX_documents_document_type"`);
    await queryRunner.query(`DROP INDEX "IDX_documents_uploaded_by_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_documents_related_party_id"`);
    await queryRunner.query(`DROP INDEX "IDX_documents_vehicle_id"`);

    await queryRunner.query(`
      ALTER TABLE "verification_events"
      DROP COLUMN "source_document_id"
    `);

    await queryRunner.query(`DROP TABLE "document_files"`);
    await queryRunner.query(`DROP TABLE "documents"`);

    await queryRunner.query(`DROP TYPE "document_ocr_status_enum"`);
    await queryRunner.query(`DROP TYPE "document_storage_kind_enum"`);
    await queryRunner.query(`DROP TYPE "document_status_enum"`);
  }
}
