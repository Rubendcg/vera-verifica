import { MigrationInterface, QueryRunner } from 'typeorm';

const ALIGNMENT_NOTE =
  'Seed legal base 2026-05-12 | Base estatal alineada a calendario federal; solo cambia schedulePosition.';

const STATE_PHYSICAL_ROWS = [
  ['5', 1, 4, 'Verificacion anual 5-6'],
  ['6', 1, 4, 'Verificacion anual 5-6'],
  ['7', 3, 6, 'Verificacion anual 7-8'],
  ['8', 3, 6, 'Verificacion anual 7-8'],
  ['3', 5, 8, 'Verificacion anual 3-4'],
  ['4', 5, 8, 'Verificacion anual 3-4'],
  ['1', 7, 10, 'Verificacion anual 1-2'],
  ['2', 7, 10, 'Verificacion anual 1-2'],
  ['9', 9, 12, 'Verificacion anual 9-0'],
  ['0', 9, 12, 'Verificacion anual 9-0'],
] as const;

export class AlignStateScheduleRules20260512201500
  implements MigrationInterface
{
  name = 'AlignStateScheduleRules20260512201500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [scheduleMarker, startMonth, endMonth, windowLabel] of STATE_PHYSICAL_ROWS) {
      await queryRunner.query(
        `
          INSERT INTO "verification_schedule_rules" (
            "regime",
            "schedule_position",
            "schedule_marker",
            "verification_type",
            "window_sequence",
            "window_start_month",
            "window_end_month",
            "window_label",
            "is_active",
            "notes"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT ON CONSTRAINT "UQ_verification_schedule_rules_scope"
          DO UPDATE SET
            "window_start_month" = EXCLUDED."window_start_month",
            "window_end_month" = EXCLUDED."window_end_month",
            "window_label" = EXCLUDED."window_label",
            "is_active" = EXCLUDED."is_active",
            "notes" = EXCLUDED."notes",
            "updated_at" = now()
        `,
        [
          'ESTATAL',
          4,
          scheduleMarker,
          'PHYSICAL_MECHANICAL',
          1,
          startMonth,
          endMonth,
          windowLabel,
          true,
          ALIGNMENT_NOTE,
        ],
      );
    }

    await queryRunner.query(`
      UPDATE "verification_schedule_rules"
      SET
        "window_start_month" = CASE WHEN "window_sequence" = 1 THEN 1 ELSE 7 END,
        "window_end_month" = CASE WHEN "window_sequence" = 1 THEN 6 ELSE 12 END,
        "window_label" = CASE WHEN "window_sequence" = 1 THEN 'Primera verificacion semestral' ELSE 'Segunda verificacion semestral' END,
        "notes" = '${ALIGNMENT_NOTE}',
        "updated_at" = now()
      WHERE "regime" = 'ESTATAL'
        AND "verification_type" = 'EMISSIONS'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "verification_schedule_rules"
      WHERE "regime" = 'ESTATAL'
        AND "verification_type" = 'PHYSICAL_MECHANICAL'
        AND "notes" = '${ALIGNMENT_NOTE}'
    `);

    await queryRunner.query(`
      UPDATE "verification_schedule_rules"
      SET
        "window_start_month" = CASE
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('1', '2') THEN 1
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('3', '4') THEN 2
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('5', '6') THEN 3
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('7', '8') THEN 4
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('9', '0') THEN 5
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('1', '2') THEN 7
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('3', '4') THEN 8
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('5', '6') THEN 9
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('7', '8') THEN 10
          ELSE 11
        END,
        "window_end_month" = CASE
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('1', '2') THEN 2
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('3', '4') THEN 3
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('5', '6') THEN 4
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('7', '8') THEN 5
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('9', '0') THEN 6
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('1', '2') THEN 8
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('3', '4') THEN 9
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('5', '6') THEN 10
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('7', '8') THEN 11
          ELSE 12
        END,
        "window_label" = CASE
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('1', '2') THEN 'Primer semestre 1-2'
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('3', '4') THEN 'Primer semestre 3-4'
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('5', '6') THEN 'Primer semestre 5-6'
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('7', '8') THEN 'Primer semestre 7-8'
          WHEN "window_sequence" = 1 AND "schedule_marker" IN ('9', '0') THEN 'Primer semestre 9-0'
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('1', '2') THEN 'Segundo semestre 1-2'
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('3', '4') THEN 'Segundo semestre 3-4'
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('5', '6') THEN 'Segundo semestre 5-6'
          WHEN "window_sequence" = 2 AND "schedule_marker" IN ('7', '8') THEN 'Segundo semestre 7-8'
          ELSE 'Segundo semestre 9-0'
        END,
        "notes" = 'Seed legal base 2026-05-12 | Yucatan emisiones por ultimo digito, programa publicado en yucatan.gob.mx para transporte publico de pasajeros.',
        "updated_at" = now()
      WHERE "regime" = 'ESTATAL'
        AND "verification_type" = 'EMISSIONS'
    `);
  }
}
