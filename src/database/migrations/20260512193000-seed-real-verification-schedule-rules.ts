import { MigrationInterface, QueryRunner } from 'typeorm';

type ScheduleRuleSeed = {
  regime: 'FEDERAL' | 'ESTATAL';
  schedulePosition: number;
  scheduleMarker: string;
  verificationType: 'PHYSICAL_MECHANICAL' | 'EMISSIONS';
  windowSequence: number;
  windowStartMonth: number;
  windowEndMonth: number;
  windowLabel: string;
  notes: string;
};

const LEGAL_SEED_NOTE = 'Seed legal base 2026-05-12';

// Seeds only the stable base calendars. Temporary prorrogas stay outside the master rule set.
function buildScheduleRuleSeeds(): ScheduleRuleSeed[] {
  const seeds: ScheduleRuleSeed[] = [];
  const allMarkers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const physicalWindows = [
    { markers: ['5', '6'], startMonth: 1, endMonth: 4, label: 'Verificacion anual 5-6' },
    { markers: ['7', '8'], startMonth: 3, endMonth: 6, label: 'Verificacion anual 7-8' },
    { markers: ['3', '4'], startMonth: 5, endMonth: 8, label: 'Verificacion anual 3-4' },
    { markers: ['1', '2'], startMonth: 7, endMonth: 10, label: 'Verificacion anual 1-2' },
    { markers: ['9', '0'], startMonth: 9, endMonth: 12, label: 'Verificacion anual 9-0' },
  ];
  const emissionsWindows = [
    { windowSequence: 1, startMonth: 1, endMonth: 6, label: 'Primera verificacion semestral' },
    { windowSequence: 2, startMonth: 7, endMonth: 12, label: 'Segunda verificacion semestral' },
  ];

  const addRules = (
    markers: string[],
    regime: 'FEDERAL' | 'ESTATAL',
    schedulePosition: number,
    verificationType: 'PHYSICAL_MECHANICAL' | 'EMISSIONS',
    windowSequence: number,
    windowStartMonth: number,
    windowEndMonth: number,
    windowLabel: string,
    notes: string,
  ) => {
    for (const scheduleMarker of markers) {
      seeds.push({
        regime,
        schedulePosition,
        scheduleMarker,
        verificationType,
        windowSequence,
        windowStartMonth,
        windowEndMonth,
        windowLabel,
        notes,
      });
    }
  };

  for (const regime of ['FEDERAL', 'ESTATAL'] as const) {
    const schedulePosition = regime === 'FEDERAL' ? 3 : 4;
    const physicalNote =
      regime === 'FEDERAL'
        ? `${LEGAL_SEED_NOTE} | Base federal fisico-mecanica 2016 en adelante, DOF 15/05/2015.`
        : `${LEGAL_SEED_NOTE} | Base estatal alineada a calendario federal; solo cambia schedulePosition.`;
    const emissionsNote =
      regime === 'FEDERAL'
        ? `${LEGAL_SEED_NOTE} | Emisiones federal 2026, DOF 03/04/2026. Se replica por marcador para compatibilidad del motor de calendario.`
        : `${LEGAL_SEED_NOTE} | Base estatal alineada a calendario federal; solo cambia schedulePosition.`;

    for (const window of physicalWindows) {
      addRules(
        window.markers,
        regime,
        schedulePosition,
        'PHYSICAL_MECHANICAL',
        1,
        window.startMonth,
        window.endMonth,
        window.label,
        physicalNote,
      );
    }

    for (const window of emissionsWindows) {
      addRules(
        allMarkers,
        regime,
        schedulePosition,
        'EMISSIONS',
        window.windowSequence,
        window.startMonth,
        window.endMonth,
        window.label,
        emissionsNote,
      );
    }
  }

  return seeds;
}

function escapeSqlText(value: string) {
  return value.replace(/'/g, "''");
}

export class SeedRealVerificationScheduleRules20260512193000
  implements MigrationInterface
{
  name = 'SeedRealVerificationScheduleRules20260512193000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "verification_schedule_rules"
      ADD COLUMN "window_sequence" smallint NOT NULL DEFAULT 1
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_schedule_rules"
      ADD CONSTRAINT "CHK_verification_schedule_rules_window_sequence"
      CHECK ("window_sequence" BETWEEN 1 AND 12)
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_schedule_rules"
      DROP CONSTRAINT "UQ_verification_schedule_rules_scope"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_schedule_rules"
      ADD CONSTRAINT "UQ_verification_schedule_rules_scope" UNIQUE (
        "regime",
        "schedule_position",
        "schedule_marker",
        "verification_type",
        "window_sequence"
      )
    `);

    const seedValues = buildScheduleRuleSeeds()
      .map(
        (row) =>
          `('${row.regime}', ${row.schedulePosition}, '${row.scheduleMarker}', '${row.verificationType}', ${row.windowSequence}, ${row.windowStartMonth}, ${row.windowEndMonth}, '${escapeSqlText(row.windowLabel)}', true, '${escapeSqlText(row.notes)}')`,
      )
      .join(',\n');

    await queryRunner.query(`
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
      VALUES
      ${seedValues}
      ON CONFLICT ON CONSTRAINT "UQ_verification_schedule_rules_scope"
      DO UPDATE SET
        "window_start_month" = EXCLUDED."window_start_month",
        "window_end_month" = EXCLUDED."window_end_month",
        "window_label" = EXCLUDED."window_label",
        "is_active" = EXCLUDED."is_active",
        "notes" = EXCLUDED."notes",
        "updated_at" = now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "verification_schedule_rules"
      WHERE "notes" LIKE '${LEGAL_SEED_NOTE}%'
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_schedule_rules"
      DROP CONSTRAINT "UQ_verification_schedule_rules_scope"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_schedule_rules"
      DROP CONSTRAINT "CHK_verification_schedule_rules_window_sequence"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_schedule_rules"
      DROP COLUMN "window_sequence"
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_schedule_rules"
      ADD CONSTRAINT "UQ_verification_schedule_rules_scope" UNIQUE (
        "regime",
        "schedule_position",
        "schedule_marker",
        "verification_type"
      )
    `);
  }
}
