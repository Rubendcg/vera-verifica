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
  ('11AB1C', 'VRAMF1A16LN000001', 'MOTF001MX26', 'Tractocamion', 'FEDERAL', '1', NULL, '1', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D01'),
  ('12CD2E', 'VRAMF2A28LS000002', 'MOTF002MX26', 'Camion unitario', 'FEDERAL', '2', NULL, '2', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D01'),
  ('13EF3G', 'VRAMF3B35LN000003', 'MOTF003MX26', 'Rabon', 'FEDERAL', '3', NULL, '3', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D02'),
  ('14GH4J', 'VRAMF4B47LS000004', 'MOTF004MX26', 'Torton', 'FEDERAL', '4', NULL, '4', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D02'),
  ('15JK5L', 'VRAMF1C53LN000005', 'MOTF005MX26', 'Tractocamion', 'FEDERAL', '5', NULL, '5', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D03'),
  ('16MN6P', 'VRAMF2C65LS000006', 'MOTF006MX26', 'Camion unitario', 'FEDERAL', '6', NULL, '6', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D03'),
  ('17QR7S', 'VRAMF3D72LN000007', 'MOTF007MX26', 'Rabon', 'FEDERAL', '7', NULL, '7', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D04'),
  ('18TU8V', 'VRAMF4D84LS000008', 'MOTF008MX26', 'Torton', 'FEDERAL', '8', NULL, '8', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D04'),
  ('19WX9Y', 'VRAMF1E99MN000009', 'MOTF009MX26', 'Tractocamion', 'FEDERAL', '9', NULL, '9', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D05'),
  ('20ZA1B', 'VRAMF2E13MS000010', 'MOTF010MX26', 'Camion unitario', 'FEDERAL', '1', NULL, '1', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D05'),
  ('TA4101A', 'VRAME1A13MN000011', 'MOTE011MX26', 'Tractocamion', 'ESTATAL', '1', NULL, '1', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D01'),
  ('TB4202B', 'VRAME2A25MS000012', 'MOTE012MX26', 'Camion unitario', 'ESTATAL', '2', NULL, '2', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D01'),
  ('TC4303C', 'VRAME3B32MN000013', 'MOTE013MX26', 'Rabon', 'ESTATAL', '3', NULL, '3', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D02'),
  ('TD4404D', 'VRAME4B44MS000014', 'MOTE014MX26', 'Torton', 'ESTATAL', '4', NULL, '4', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D02'),
  ('TE4505E', 'VRAME1C50MN000015', 'MOTE015MX26', 'Tractocamion', 'ESTATAL', '5', NULL, '5', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D03'),
  ('TF4606F', 'VRAME2C62MS000016', 'MOTE016MX26', 'Camion unitario', 'ESTATAL', '6', NULL, '6', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D03'),
  ('TG4707G', 'VRAME3D78NN000017', 'MOTE017MX26', 'Rabon', 'ESTATAL', '7', NULL, '7', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D04'),
  ('TH4808H', 'VRAME4D8XNS000018', 'MOTE018MX26', 'Torton', 'ESTATAL', '8', NULL, '8', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D04'),
  ('TJ4909J', 'VRAME1E96NN000019', 'MOTE019MX26', 'Tractocamion', 'ESTATAL', '9', NULL, '9', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D05'),
  ('TK4010K', 'VRAME2E01NS000020', 'MOTE020MX26', 'Camion unitario', 'ESTATAL', '0', NULL, '0', true, 'SEED_REVIEW_2026_05; class=MOTOR; requires_physical=true; requires_emissions=true; owner_code=D05'),
  ('21BC2D', 'VRAAF1A23NN000021', NULL, 'Remolque', 'FEDERAL', '2', NULL, '2', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D01'),
  ('22DE3F', 'VRAAF2A35NS000022', NULL, 'Semirremolque', 'FEDERAL', '3', NULL, '3', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D01'),
  ('23FG4H', 'VRAAF3B42NN000023', NULL, 'Caja seca', 'FEDERAL', '4', NULL, '4', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D02'),
  ('24HJ5K', 'VRAAF4B54NS000024', NULL, 'Plataforma', 'FEDERAL', '5', NULL, '5', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D02'),
  ('25KL6M', 'VRAAF1C67PN000025', NULL, 'Remolque', 'FEDERAL', '6', NULL, '6', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D03'),
  ('26NP7Q', 'VRAAF2C79PS000026', NULL, 'Semirremolque', 'FEDERAL', '7', NULL, '7', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D03'),
  ('27RS8T', 'VRAAF3D86PN000027', NULL, 'Caja seca', 'FEDERAL', '8', NULL, '8', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D04'),
  ('28UV9W', 'VRAAF4D98PS000028', NULL, 'Plataforma', 'FEDERAL', '9', NULL, '9', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D04'),
  ('29XY1Z', 'VRAAF1E12PN000029', NULL, 'Remolque', 'FEDERAL', '1', NULL, '1', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D05'),
  ('30AC2D', 'VRAAF2E29PS000030', NULL, 'Semirremolque', 'FEDERAL', '2', NULL, '2', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D05'),
  ('UA5101A', 'VRAAE1A1XPN000031', NULL, 'Remolque', 'ESTATAL', '1', NULL, '1', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D01'),
  ('UB5202B', 'VRAAE2A21PS000032', NULL, 'Semirremolque', 'ESTATAL', '2', NULL, '2', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D01'),
  ('UC5303C', 'VRAAE3B35RN000033', NULL, 'Caja seca', 'ESTATAL', '3', NULL, '3', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D02'),
  ('UD5404D', 'VRAAE4B47RS000034', NULL, 'Plataforma', 'ESTATAL', '4', NULL, '4', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D02'),
  ('UE5505E', 'VRAAE1C53RN000035', NULL, 'Remolque', 'ESTATAL', '5', NULL, '5', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D03'),
  ('UF5606F', 'VRAAE2C65RS000036', NULL, 'Semirremolque', 'ESTATAL', '6', NULL, '6', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D03'),
  ('UG5707G', 'VRAAE3D72RN000037', NULL, 'Caja seca', 'ESTATAL', '7', NULL, '7', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D04'),
  ('UH5808H', 'VRAAE4D84RS000038', NULL, 'Plataforma', 'ESTATAL', '8', NULL, '8', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D04'),
  ('UJ5909J', 'VRAAE1E90RN000039', NULL, 'Remolque', 'ESTATAL', '9', NULL, '9', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D05'),
  ('UK5010K', 'VRAAE2E06RS000040', NULL, 'Semirremolque', 'ESTATAL', '0', NULL, '0', true, 'SEED_REVIEW_2026_05; class=ARRASTRE; requires_physical=true; requires_emissions=false; owner_code=D05')
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

DELETE FROM verification_events
WHERE observations = 'SEED_REVIEW_2026_05_EVENT';

WITH verification_event_seed (
  plate,
  center_code,
  verification_type,
  event_date,
  valid_until,
  certificate_folio
) AS (
  VALUES
    ('11AB1C', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-05-12', DATE '2026-05-12', 'SEED26-FIS-M001'),
    ('11AB1C', 'CVF-001', 'EMISSIONS', DATE '2025-11-14', DATE '2026-05-14', 'SEED26-HUM-M001'),
    ('12CD2E', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-05-20', DATE '2026-05-20', 'SEED26-FIS-M002'),
    ('12CD2E', 'CVF-002', 'EMISSIONS', DATE '2025-11-22', DATE '2026-05-22', 'SEED26-HUM-M002'),
    ('13EF3G', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-05-28', DATE '2026-05-28', 'SEED26-FIS-M003'),
    ('13EF3G', 'CVF-002', 'EMISSIONS', DATE '2025-11-30', DATE '2026-05-30', 'SEED26-HUM-M003'),
    ('14GH4J', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-06-05', DATE '2026-06-05', 'SEED26-FIS-M004'),
    ('14GH4J', 'CVF-001', 'EMISSIONS', DATE '2025-12-08', DATE '2026-06-08', 'SEED26-HUM-M004'),
    ('15JK5L', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-06-13', DATE '2026-06-13', 'SEED26-FIS-M005'),
    ('15JK5L', 'CVF-001', 'EMISSIONS', DATE '2025-12-16', DATE '2026-06-16', 'SEED26-HUM-M005'),
    ('16MN6P', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-06-21', DATE '2026-06-21', 'SEED26-FIS-M006'),
    ('16MN6P', 'CVF-002', 'EMISSIONS', DATE '2025-12-24', DATE '2026-06-24', 'SEED26-HUM-M006'),
    ('17QR7S', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-06-29', DATE '2026-06-29', 'SEED26-FIS-M007'),
    ('17QR7S', 'CVF-002', 'EMISSIONS', DATE '2026-01-01', DATE '2026-07-01', 'SEED26-HUM-M007'),
    ('18TU8V', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-07-07', DATE '2026-07-07', 'SEED26-FIS-M008'),
    ('18TU8V', 'CVF-001', 'EMISSIONS', DATE '2026-01-09', DATE '2026-07-09', 'SEED26-HUM-M008'),
    ('19WX9Y', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-07-15', DATE '2026-07-15', 'SEED26-FIS-M009'),
    ('19WX9Y', 'CVF-001', 'EMISSIONS', DATE '2026-01-17', DATE '2026-07-17', 'SEED26-HUM-M009'),
    ('20ZA1B', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-07-23', DATE '2026-07-23', 'SEED26-FIS-M010'),
    ('20ZA1B', 'CVF-002', 'EMISSIONS', DATE '2026-01-25', DATE '2026-07-25', 'SEED26-HUM-M010'),
    ('TA4101A', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-07-31', DATE '2026-07-31', 'SEED26-FIS-M011'),
    ('TA4101A', 'CVF-001', 'EMISSIONS', DATE '2026-02-02', DATE '2026-08-02', 'SEED26-HUM-M011'),
    ('TB4202B', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-08-08', DATE '2026-08-08', 'SEED26-FIS-M012'),
    ('TB4202B', 'CVF-002', 'EMISSIONS', DATE '2026-02-10', DATE '2026-08-10', 'SEED26-HUM-M012'),
    ('TC4303C', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-08-16', DATE '2026-08-16', 'SEED26-FIS-M013'),
    ('TC4303C', 'CVF-002', 'EMISSIONS', DATE '2026-02-18', DATE '2026-08-18', 'SEED26-HUM-M013'),
    ('TD4404D', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-08-24', DATE '2026-08-24', 'SEED26-FIS-M014'),
    ('TD4404D', 'CVF-001', 'EMISSIONS', DATE '2026-02-26', DATE '2026-08-26', 'SEED26-HUM-M014'),
    ('TE4505E', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-09-01', DATE '2026-09-01', 'SEED26-FIS-M015'),
    ('TE4505E', 'CVF-001', 'EMISSIONS', DATE '2026-03-06', DATE '2026-09-06', 'SEED26-HUM-M015'),
    ('TF4606F', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-09-09', DATE '2026-09-09', 'SEED26-FIS-M016'),
    ('TF4606F', 'CVF-002', 'EMISSIONS', DATE '2026-03-14', DATE '2026-09-14', 'SEED26-HUM-M016'),
    ('TG4707G', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-09-17', DATE '2026-09-17', 'SEED26-FIS-M017'),
    ('TG4707G', 'CVF-002', 'EMISSIONS', DATE '2026-03-22', DATE '2026-09-22', 'SEED26-HUM-M017'),
    ('TH4808H', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-09-25', DATE '2026-09-25', 'SEED26-FIS-M018'),
    ('TH4808H', 'CVF-001', 'EMISSIONS', DATE '2026-03-30', DATE '2026-09-30', 'SEED26-HUM-M018'),
    ('TJ4909J', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-10-03', DATE '2026-10-03', 'SEED26-FIS-M019'),
    ('TJ4909J', 'CVF-001', 'EMISSIONS', DATE '2026-04-07', DATE '2026-10-07', 'SEED26-HUM-M019'),
    ('TK4010K', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-10-11', DATE '2026-10-11', 'SEED26-FIS-M020'),
    ('TK4010K', 'CVF-002', 'EMISSIONS', DATE '2026-04-15', DATE '2026-10-15', 'SEED26-HUM-M020'),
    ('21BC2D', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-05-18', DATE '2026-05-18', 'SEED26-FIS-A001'),
    ('22DE3F', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-05-26', DATE '2026-05-26', 'SEED26-FIS-A002'),
    ('23FG4H', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-06-03', DATE '2026-06-03', 'SEED26-FIS-A003'),
    ('24HJ5K', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-06-11', DATE '2026-06-11', 'SEED26-FIS-A004'),
    ('25KL6M', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-06-19', DATE '2026-06-19', 'SEED26-FIS-A005'),
    ('26NP7Q', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-06-27', DATE '2026-06-27', 'SEED26-FIS-A006'),
    ('27RS8T', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-07-05', DATE '2026-07-05', 'SEED26-FIS-A007'),
    ('28UV9W', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-07-13', DATE '2026-07-13', 'SEED26-FIS-A008'),
    ('29XY1Z', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-07-21', DATE '2026-07-21', 'SEED26-FIS-A009'),
    ('30AC2D', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-07-29', DATE '2026-07-29', 'SEED26-FIS-A010'),
    ('UA5101A', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-08-06', DATE '2026-08-06', 'SEED26-FIS-A011'),
    ('UB5202B', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-08-14', DATE '2026-08-14', 'SEED26-FIS-A012'),
    ('UC5303C', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-08-22', DATE '2026-08-22', 'SEED26-FIS-A013'),
    ('UD5404D', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-08-30', DATE '2026-08-30', 'SEED26-FIS-A014'),
    ('UE5505E', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-09-07', DATE '2026-09-07', 'SEED26-FIS-A015'),
    ('UF5606F', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-09-15', DATE '2026-09-15', 'SEED26-FIS-A016'),
    ('UG5707G', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-09-23', DATE '2026-09-23', 'SEED26-FIS-A017'),
    ('UH5808H', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-10-01', DATE '2026-10-01', 'SEED26-FIS-A018'),
    ('UJ5909J', 'CVF-001', 'PHYSICAL_MECHANICAL', DATE '2025-10-09', DATE '2026-10-09', 'SEED26-FIS-A019'),
    ('UK5010K', 'CVF-002', 'PHYSICAL_MECHANICAL', DATE '2025-10-17', DATE '2026-10-17', 'SEED26-FIS-A020')
)
INSERT INTO verification_events (
  vehicle_id,
  center_id,
  verification_type,
  event_date,
  valid_until,
  result_status,
  certificate_folio,
  observations
)
SELECT
  vehicles.id,
  verification_centers.id,
  verification_event_seed.verification_type::verification_type_enum,
  verification_event_seed.event_date,
  verification_event_seed.valid_until,
  'PASSED'::verification_result_status_enum,
  verification_event_seed.certificate_folio,
  'SEED_REVIEW_2026_05_EVENT'
FROM verification_event_seed
JOIN vehicles ON vehicles.plate = verification_event_seed.plate
JOIN verification_centers ON verification_centers.code = verification_event_seed.center_code;

COMMIT;
