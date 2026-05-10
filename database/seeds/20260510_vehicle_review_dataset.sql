BEGIN;

INSERT INTO verification_centers (
  center_type,
  code,
  name,
  state_code,
  city,
  address_line,
  contact_name,
  phone,
  email,
  is_active
)
VALUES
  (
    'FEDERAL_AND_STATE',
    'CVF-001',
    'Centro Integral de Verificacion Merida Norte',
    'YUC',
    'Merida',
    'Calle 60 Norte 125, Merida, Yucatan',
    'Coordinacion Merida Norte',
    '9991000001',
    'merida.norte@veracentros.mx',
    true
  ),
  (
    'FEDERAL_AND_STATE',
    'CVF-002',
    'Centro Integral de Verificacion Merida Sur',
    'YUC',
    'Merida',
    'Avenida Itzaes 540, Merida, Yucatan',
    'Coordinacion Merida Sur',
    '9991000002',
    'merida.sur@veracentros.mx',
    true
  )
ON CONFLICT (code) DO UPDATE
SET
  center_type = EXCLUDED.center_type,
  name = EXCLUDED.name,
  state_code = EXCLUDED.state_code,
  city = EXCLUDED.city,
  address_line = EXCLUDED.address_line,
  contact_name = EXCLUDED.contact_name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  is_active = EXCLUDED.is_active;

INSERT INTO parties (
  party_type,
  rfc,
  legal_name,
  display_name,
  phone,
  email,
  is_active,
  notes
)
VALUES
  (
    'COMPANY',
    'TDM240101AB1',
    'Transportes del Mayab SA de CV',
    'Transportes del Mayab',
    '9992000001',
    'contacto@tdm.mx',
    true,
    'SEED_REVIEW_2026_05_OWNER'
  ),
  (
    'COMPANY',
    'LPS240101BC2',
    'Logistica Peninsular del Sureste SA de CV',
    'Logistica Peninsular del Sureste',
    '9992000002',
    'contacto@lps.mx',
    true,
    'SEED_REVIEW_2026_05_OWNER'
  ),
  (
    'COMPANY',
    'CIG240101CD3',
    'Carga Integral del Golfo SA de CV',
    'Carga Integral del Golfo',
    '9992000003',
    'contacto@cig.mx',
    true,
    'SEED_REVIEW_2026_05_OWNER'
  ),
  (
    'COMPANY',
    'ACC240101DE4',
    'Arrendadora Carretera del Centro SA de CV',
    'Arrendadora Carretera del Centro',
    '9992000004',
    'contacto@acc.mx',
    true,
    'SEED_REVIEW_2026_05_OWNER'
  ),
  (
    'COMPANY',
    'SFS240101EF5',
    'Soluciones de Flota del Sureste SA de CV',
    'Soluciones de Flota del Sureste',
    '9992000005',
    'contacto@sfs.mx',
    true,
    'SEED_REVIEW_2026_05_OWNER'
  )
ON CONFLICT (rfc) DO UPDATE
SET
  legal_name = EXCLUDED.legal_name,
  display_name = EXCLUDED.display_name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  is_active = EXCLUDED.is_active,
  notes = EXCLUDED.notes;

INSERT INTO vehicles (
  plate,
  serial_niv,
  engine_number,
  unit_type,
  regime,
  schedule_marker_auto,
  schedule_marker_override,
  schedule_marker_effective,
  is_active,
  notes
)
VALUES
  ('11AB1C', 'NIVM001MX2026', 'MOTF001MX26', 'Tractocamion', 'FEDERAL', 'A', NULL, 'A', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D01'),
  ('12CD2E', 'NIVM002MX2026', 'MOTF002MX26', 'Camion unitario', 'FEDERAL', 'C', NULL, 'C', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D01'),
  ('13EF3G', 'NIVM003MX2026', 'MOTF003MX26', 'Rabon', 'FEDERAL', 'E', NULL, 'E', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D02'),
  ('14GH4J', 'NIVM004MX2026', 'MOTF004MX26', 'Torton', 'FEDERAL', 'G', NULL, 'G', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D02'),
  ('15JK5L', 'NIVM005MX2026', 'MOTF005MX26', 'Tractocamion', 'FEDERAL', 'J', NULL, 'J', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D03'),
  ('16MN6P', 'NIVM006MX2026', 'MOTF006MX26', 'Camion unitario', 'FEDERAL', 'M', NULL, 'M', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D03'),
  ('17QR7S', 'NIVM007MX2026', 'MOTF007MX26', 'Rabon', 'FEDERAL', 'Q', NULL, 'Q', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D04'),
  ('18TU8V', 'NIVM008MX2026', 'MOTF008MX26', 'Torton', 'FEDERAL', 'T', NULL, 'T', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D04'),
  ('19WX9Y', 'NIVM009MX2026', 'MOTF009MX26', 'Tractocamion', 'FEDERAL', 'W', NULL, 'W', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D05'),
  ('20ZA1B', 'NIVM010MX2026', 'MOTF010MX26', 'Camion unitario', 'FEDERAL', 'Z', NULL, 'Z', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D05'),
  ('TA4101A', 'NIVM011MX2026', 'MOTE011MX26', 'Tractocamion', 'ESTATAL', '1', NULL, '1', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D01'),
  ('TB4202B', 'NIVM012MX2026', 'MOTE012MX26', 'Camion unitario', 'ESTATAL', '2', NULL, '2', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D01'),
  ('TC4303C', 'NIVM013MX2026', 'MOTE013MX26', 'Rabon', 'ESTATAL', '3', NULL, '3', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D02'),
  ('TD4404D', 'NIVM014MX2026', 'MOTE014MX26', 'Torton', 'ESTATAL', '4', NULL, '4', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D02'),
  ('TE4505E', 'NIVM015MX2026', 'MOTE015MX26', 'Tractocamion', 'ESTATAL', '5', NULL, '5', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D03'),
  ('TF4606F', 'NIVM016MX2026', 'MOTE016MX26', 'Camion unitario', 'ESTATAL', '6', NULL, '6', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D03'),
  ('TG4707G', 'NIVM017MX2026', 'MOTE017MX26', 'Rabon', 'ESTATAL', '7', NULL, '7', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D04'),
  ('TH4808H', 'NIVM018MX2026', 'MOTE018MX26', 'Torton', 'ESTATAL', '8', NULL, '8', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D04'),
  ('TJ4909J', 'NIVM019MX2026', 'MOTE019MX26', 'Tractocamion', 'ESTATAL', '9', NULL, '9', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D05'),
  ('TK4010K', 'NIVM020MX2026', 'MOTE020MX26', 'Camion unitario', 'ESTATAL', '0', NULL, '0', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D05'),
  ('21BC2D', 'NIVA001MX2026', NULL, 'Remolque', 'FEDERAL', 'B', NULL, 'B', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D01'),
  ('22DE3F', 'NIVA002MX2026', NULL, 'Semirremolque', 'FEDERAL', 'D', NULL, 'D', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D01'),
  ('23FG4H', 'NIVA003MX2026', NULL, 'Caja seca', 'FEDERAL', 'F', NULL, 'F', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D02'),
  ('24HJ5K', 'NIVA004MX2026', NULL, 'Plataforma', 'FEDERAL', 'H', NULL, 'H', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D02'),
  ('25KL6M', 'NIVA005MX2026', NULL, 'Remolque', 'FEDERAL', 'K', NULL, 'K', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D03'),
  ('26NP7Q', 'NIVA006MX2026', NULL, 'Semirremolque', 'FEDERAL', 'N', NULL, 'N', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D03'),
  ('27RS8T', 'NIVA007MX2026', NULL, 'Caja seca', 'FEDERAL', 'R', NULL, 'R', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D04'),
  ('28UV9W', 'NIVA008MX2026', NULL, 'Plataforma', 'FEDERAL', 'U', NULL, 'U', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D04'),
  ('29XY1Z', 'NIVA009MX2026', NULL, 'Remolque', 'FEDERAL', 'X', NULL, 'X', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D05'),
  ('30AC2D', 'NIVA010MX2026', NULL, 'Semirremolque', 'FEDERAL', 'A', NULL, 'A', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D05'),
  ('UA5101A', 'NIVA011MX2026', NULL, 'Remolque', 'ESTATAL', '1', NULL, '1', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D01'),
  ('UB5202B', 'NIVA012MX2026', NULL, 'Semirremolque', 'ESTATAL', '2', NULL, '2', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D01'),
  ('UC5303C', 'NIVA013MX2026', NULL, 'Caja seca', 'ESTATAL', '3', NULL, '3', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D02'),
  ('UD5404D', 'NIVA014MX2026', NULL, 'Plataforma', 'ESTATAL', '4', NULL, '4', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D02'),
  ('UE5505E', 'NIVA015MX2026', NULL, 'Remolque', 'ESTATAL', '5', NULL, '5', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D03'),
  ('UF5606F', 'NIVA016MX2026', NULL, 'Semirremolque', 'ESTATAL', '6', NULL, '6', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D03'),
  ('UG5707G', 'NIVA017MX2026', NULL, 'Caja seca', 'ESTATAL', '7', NULL, '7', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D04'),
  ('UH5808H', 'NIVA018MX2026', NULL, 'Plataforma', 'ESTATAL', '8', NULL, '8', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D04'),
  ('UJ5909J', 'NIVA019MX2026', NULL, 'Remolque', 'ESTATAL', '9', NULL, '9', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D05'),
  ('UK5010K', 'NIVA020MX2026', NULL, 'Semirremolque', 'ESTATAL', '0', NULL, '0', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D05')
ON CONFLICT (plate) DO UPDATE
SET
  serial_niv = EXCLUDED.serial_niv,
  engine_number = EXCLUDED.engine_number,
  unit_type = EXCLUDED.unit_type,
  regime = EXCLUDED.regime,
  schedule_marker_auto = EXCLUDED.schedule_marker_auto,
  schedule_marker_override = EXCLUDED.schedule_marker_override,
  schedule_marker_effective = EXCLUDED.schedule_marker_effective,
  is_active = EXCLUDED.is_active,
  notes = EXCLUDED.notes;

DELETE FROM vehicle_party_roles
WHERE notes = 'SEED_REVIEW_2026_05_OWNER';

WITH ownership_map (plate, owner_rfc) AS (
  VALUES
    ('11AB1C', 'TDM240101AB1'),
    ('12CD2E', 'TDM240101AB1'),
    ('13EF3G', 'LPS240101BC2'),
    ('14GH4J', 'LPS240101BC2'),
    ('15JK5L', 'CIG240101CD3'),
    ('16MN6P', 'CIG240101CD3'),
    ('17QR7S', 'ACC240101DE4'),
    ('18TU8V', 'ACC240101DE4'),
    ('19WX9Y', 'SFS240101EF5'),
    ('20ZA1B', 'SFS240101EF5'),
    ('TA4101A', 'TDM240101AB1'),
    ('TB4202B', 'TDM240101AB1'),
    ('TC4303C', 'LPS240101BC2'),
    ('TD4404D', 'LPS240101BC2'),
    ('TE4505E', 'CIG240101CD3'),
    ('TF4606F', 'CIG240101CD3'),
    ('TG4707G', 'ACC240101DE4'),
    ('TH4808H', 'ACC240101DE4'),
    ('TJ4909J', 'SFS240101EF5'),
    ('TK4010K', 'SFS240101EF5'),
    ('21BC2D', 'TDM240101AB1'),
    ('22DE3F', 'TDM240101AB1'),
    ('23FG4H', 'LPS240101BC2'),
    ('24HJ5K', 'LPS240101BC2'),
    ('25KL6M', 'CIG240101CD3'),
    ('26NP7Q', 'CIG240101CD3'),
    ('27RS8T', 'ACC240101DE4'),
    ('28UV9W', 'ACC240101DE4'),
    ('29XY1Z', 'SFS240101EF5'),
    ('30AC2D', 'SFS240101EF5'),
    ('UA5101A', 'TDM240101AB1'),
    ('UB5202B', 'TDM240101AB1'),
    ('UC5303C', 'LPS240101BC2'),
    ('UD5404D', 'LPS240101BC2'),
    ('UE5505E', 'CIG240101CD3'),
    ('UF5606F', 'CIG240101CD3'),
    ('UG5707G', 'ACC240101DE4'),
    ('UH5808H', 'ACC240101DE4'),
    ('UJ5909J', 'SFS240101EF5'),
    ('UK5010K', 'SFS240101EF5')
)
INSERT INTO vehicle_party_roles (
  vehicle_id,
  party_id,
  role_type,
  start_date,
  end_date,
  is_current,
  notes
)
SELECT
  vehicles.id,
  parties.id,
  'OWNER',
  DATE '2026-01-01',
  NULL,
  true,
  'SEED_REVIEW_2026_05_OWNER'
FROM ownership_map
JOIN vehicles ON vehicles.plate = ownership_map.plate
JOIN parties ON parties.rfc = ownership_map.owner_rfc;

COMMIT;
