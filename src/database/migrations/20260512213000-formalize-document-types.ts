import { MigrationInterface, QueryRunner } from 'typeorm';

export class FormalizeDocumentTypes20260512213000
  implements MigrationInterface
{
  name = 'FormalizeDocumentTypes20260512213000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "document_type_enum" AS ENUM (
        'TARJETA_CIRCULACION',
        'CONSTANCIA_FISICO_MECANICA',
        'CONSTANCIA_EMISIONES',
        'PERMISO',
        'CONTRATO_ARRENDAMIENTO',
        'OTRO'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "documents"
      ALTER COLUMN "document_type"
      TYPE "document_type_enum"
      USING (
        CASE
          WHEN upper(trim("document_type")) IN (
            'TARJETA_CIRCULACION',
            'TARJETA DE CIRCULACION',
            'TARJETA CIRCULACION'
          ) THEN 'TARJETA_CIRCULACION'::"document_type_enum"
          WHEN upper(trim("document_type")) IN (
            'CONSTANCIA_FISICO_MECANICA',
            'CONSTANCIA FISICO MECANICA',
            'CONSTANCIA FISICO-MECANICA',
            'FISICO_MECANICA',
            'FISICO MECANICA'
          ) THEN 'CONSTANCIA_FISICO_MECANICA'::"document_type_enum"
          WHEN upper(trim("document_type")) IN (
            'CONSTANCIA_EMISIONES',
            'CONSTANCIA DE EMISIONES',
            'CONSTANCIA EMISIONES',
            'CONSTANCIA_CONTAMINANTES',
            'CONTAMINANTE',
            'EMISIONES'
          ) THEN 'CONSTANCIA_EMISIONES'::"document_type_enum"
          WHEN upper(trim("document_type")) IN (
            'PERMISO'
          ) THEN 'PERMISO'::"document_type_enum"
          WHEN upper(trim("document_type")) IN (
            'CONTRATO_ARRENDAMIENTO',
            'CONTRATO DE ARRENDAMIENTO'
          ) THEN 'CONTRATO_ARRENDAMIENTO'::"document_type_enum"
          ELSE 'OTRO'::"document_type_enum"
        END
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "documents"
      ALTER COLUMN "document_type"
      TYPE character varying(100)
      USING ("document_type"::text)
    `);

    await queryRunner.query(`DROP TYPE "document_type_enum"`);
  }
}
