CREATE OR REPLACE VIEW vw_current_vehicle_relationships AS
SELECT
  v.id AS vehicle_id,
  v.serial_niv,
  v.plate,
  owner_rel.party_id AS owner_party_id,
  owner_party.display_name AS owner_display_name,
  owner_party.legal_name AS owner_legal_name,
  client_rel.party_id AS client_party_id,
  client_party.display_name AS client_display_name,
  client_party.legal_name AS client_legal_name,
  legal_rel.party_id AS legal_possessor_party_id,
  legal_party.display_name AS legal_possessor_display_name,
  legal_party.legal_name AS legal_possessor_legal_name
FROM vehicles v
LEFT JOIN LATERAL (
  SELECT party_id
  FROM vehicle_party_roles
  WHERE vehicle_id = v.id
    AND role_type = 'OWNER'
    AND is_current = true
  LIMIT 1
) owner_rel ON true
LEFT JOIN parties owner_party ON owner_party.id = owner_rel.party_id
LEFT JOIN LATERAL (
  SELECT party_id
  FROM vehicle_party_roles
  WHERE vehicle_id = v.id
    AND role_type = 'CLIENT'
    AND is_current = true
  LIMIT 1
) client_rel ON true
LEFT JOIN parties client_party ON client_party.id = client_rel.party_id
LEFT JOIN LATERAL (
  SELECT party_id
  FROM vehicle_party_roles
  WHERE vehicle_id = v.id
    AND role_type = 'LEGAL_POSSESSOR'
    AND is_current = true
  LIMIT 1
) legal_rel ON true
LEFT JOIN parties legal_party ON legal_party.id = legal_rel.party_id;

CREATE OR REPLACE VIEW vw_vehicle_latest_verification_events AS
WITH ranked_events AS (
  SELECT
    ve.*,
    row_number() OVER (
      PARTITION BY ve.vehicle_id, ve.verification_type
      ORDER BY ve.event_date DESC, ve.id DESC
    ) AS rn
  FROM verification_events ve
)
SELECT
  id,
  vehicle_id,
  center_id,
  source_document_id,
  verification_type,
  event_date,
  valid_until,
  result_status,
  certificate_folio,
  observations,
  created_at,
  updated_at
FROM ranked_events
WHERE rn = 1;

CREATE OR REPLACE VIEW vw_vehicle_official_document_status AS
SELECT
  v.id AS vehicle_id,
  v.serial_niv,
  v.plate,
  EXISTS (
    SELECT 1
    FROM documents d
    JOIN document_files df ON df.document_id = d.id AND df.is_current = true
    WHERE d.vehicle_id = v.id
      AND d.document_type = 'TARJETA_CIRCULACION'
      AND d.document_status = 'ACTIVE'
  ) AS has_tarjeta_circulacion,
  EXISTS (
    SELECT 1
    FROM documents d
    JOIN document_files df ON df.document_id = d.id AND df.is_current = true
    WHERE d.vehicle_id = v.id
      AND d.document_type = 'CONSTANCIA_FISICO_MECANICA'
      AND d.document_status = 'ACTIVE'
  ) AS has_constancia_fisico_mecanica,
  EXISTS (
    SELECT 1
    FROM documents d
    JOIN document_files df ON df.document_id = d.id AND df.is_current = true
    WHERE d.vehicle_id = v.id
      AND d.document_type = 'CONSTANCIA_EMISIONES'
      AND d.document_status = 'ACTIVE'
  ) AS has_constancia_emisiones
FROM vehicles v;

CREATE OR REPLACE VIEW vw_mvp_vehicle_master AS
SELECT
  v.id AS vehicle_id,
  v.serial_niv,
  v.plate,
  v.unit_type,
  v.regime,
  v.schedule_marker_effective,
  rel.owner_party_id,
  rel.owner_display_name,
  rel.client_party_id,
  rel.client_display_name,
  rel.legal_possessor_party_id,
  rel.legal_possessor_display_name,
  phys.event_date AS physical_mechanical_event_date,
  phys.valid_until AS physical_mechanical_valid_until,
  phys.result_status AS physical_mechanical_result_status,
  phys.center_id AS physical_mechanical_center_id,
  emi.event_date AS emissions_event_date,
  emi.valid_until AS emissions_valid_until,
  emi.result_status AS emissions_result_status,
  emi.center_id AS emissions_center_id,
  docs.has_tarjeta_circulacion,
  docs.has_constancia_fisico_mecanica,
  docs.has_constancia_emisiones
FROM vehicles v
LEFT JOIN vw_current_vehicle_relationships rel
  ON rel.vehicle_id = v.id
LEFT JOIN vw_vehicle_latest_verification_events phys
  ON phys.vehicle_id = v.id
 AND phys.verification_type = 'PHYSICAL_MECHANICAL'
LEFT JOIN vw_vehicle_latest_verification_events emi
  ON emi.vehicle_id = v.id
 AND emi.verification_type = 'EMISSIONS'
LEFT JOIN vw_vehicle_official_document_status docs
  ON docs.vehicle_id = v.id;
