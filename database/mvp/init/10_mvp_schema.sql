CREATE TYPE party_type_enum AS ENUM (
  'INDIVIDUAL',
  'COMPANY'
);

CREATE TYPE vehicle_regime_enum AS ENUM (
  'FEDERAL',
  'ESTATAL'
);

CREATE TYPE vehicle_party_role_type_enum AS ENUM (
  'OWNER',
  'CLIENT',
  'LEGAL_POSSESSOR'
);

CREATE TYPE verification_type_enum AS ENUM (
  'PHYSICAL_MECHANICAL',
  'EMISSIONS'
);

CREATE TYPE verification_result_status_enum AS ENUM (
  'PASSED',
  'FAILED',
  'CONDITIONAL',
  'CANCELLED'
);

CREATE TYPE document_type_enum AS ENUM (
  'TARJETA_CIRCULACION',
  'CONSTANCIA_FISICO_MECANICA',
  'CONSTANCIA_EMISIONES'
);

CREATE TYPE document_status_enum AS ENUM (
  'ACTIVE',
  'EXPIRED',
  'CANCELLED',
  'ARCHIVED',
  'PENDING_REVIEW'
);

CREATE TYPE document_storage_kind_enum AS ENUM (
  'LOCAL_PATH',
  'OBJECT_STORAGE',
  'DATABASE'
);

CREATE TYPE document_ocr_status_enum AS ENUM (
  'NOT_REQUESTED',
  'PENDING',
  'COMPLETED',
  'FAILED'
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE parties (
  id BIGSERIAL PRIMARY KEY,
  party_type party_type_enum NOT NULL,
  rfc character varying(13),
  legal_name character varying(255) NOT NULL,
  display_name character varying(255) NOT NULL,
  phone character varying(30),
  email character varying(255),
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_parties_rfc UNIQUE (rfc),
  CONSTRAINT chk_parties_legal_name_not_blank CHECK (btrim(legal_name) <> ''),
  CONSTRAINT chk_parties_display_name_not_blank CHECK (btrim(display_name) <> '')
);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  party_id bigint REFERENCES parties(id) ON DELETE SET NULL,
  email character varying(255) NOT NULL,
  password_hash character varying(255),
  full_name character varying(255) NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT chk_users_full_name_not_blank CHECK (btrim(full_name) <> '')
);

CREATE TABLE vehicles (
  id BIGSERIAL PRIMARY KEY,
  plate character varying(20) NOT NULL,
  serial_niv character varying(100) NOT NULL,
  engine_number character varying(100),
  unit_type character varying(100) NOT NULL,
  regime vehicle_regime_enum NOT NULL,
  schedule_marker_auto character(1) NOT NULL,
  schedule_marker_override character(1),
  schedule_marker_effective character(1) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_vehicles_plate UNIQUE (plate),
  CONSTRAINT uq_vehicles_serial_niv UNIQUE (serial_niv),
  CONSTRAINT chk_vehicles_plate_not_blank CHECK (btrim(plate) <> ''),
  CONSTRAINT chk_vehicles_serial_niv_not_blank CHECK (btrim(serial_niv) <> ''),
  CONSTRAINT chk_vehicles_unit_type_not_blank CHECK (btrim(unit_type) <> '')
);

CREATE TABLE vehicle_party_roles (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id bigint NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  party_id bigint NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  role_type vehicle_party_role_type_enum NOT NULL,
  start_date date NOT NULL,
  end_date date,
  is_current boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_vehicle_party_roles_date_range CHECK (
    end_date IS NULL OR end_date >= start_date
  ),
  CONSTRAINT chk_vehicle_party_roles_current_consistency CHECK (
    (is_current = true AND end_date IS NULL) OR
    (is_current = false AND end_date IS NOT NULL)
  )
);

CREATE TABLE verification_centers (
  id BIGSERIAL PRIMARY KEY,
  center_type character varying(50) NOT NULL,
  code character varying(30) NOT NULL,
  name character varying(255) NOT NULL,
  state_code character varying(10),
  city character varying(120),
  address_line character varying(255),
  contact_name character varying(255),
  phone character varying(30),
  email character varying(255),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_verification_centers_code UNIQUE (code),
  CONSTRAINT chk_verification_centers_name_not_blank CHECK (btrim(name) <> '')
);

CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id bigint NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  related_party_id bigint REFERENCES parties(id) ON DELETE SET NULL,
  uploaded_by_user_id bigint REFERENCES users(id) ON DELETE SET NULL,
  document_type document_type_enum NOT NULL,
  verification_type verification_type_enum,
  document_number character varying(100),
  issue_date date,
  valid_until date,
  document_status document_status_enum NOT NULL DEFAULT 'ACTIVE',
  is_visible_to_owner boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_documents_date_range CHECK (
    issue_date IS NULL OR valid_until IS NULL OR valid_until >= issue_date
  ),
  CONSTRAINT chk_documents_type_vs_verification CHECK (
    (document_type = 'TARJETA_CIRCULACION' AND verification_type IS NULL) OR
    (document_type = 'CONSTANCIA_FISICO_MECANICA' AND verification_type = 'PHYSICAL_MECHANICAL') OR
    (document_type = 'CONSTANCIA_EMISIONES' AND verification_type = 'EMISSIONS')
  )
);

CREATE TABLE verification_events (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id bigint NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  center_id bigint REFERENCES verification_centers(id) ON DELETE SET NULL,
  source_document_id bigint,
  verification_type verification_type_enum NOT NULL,
  event_date date NOT NULL,
  valid_until date NOT NULL,
  result_status verification_result_status_enum NOT NULL DEFAULT 'PASSED',
  certificate_folio character varying(100),
  observations text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_verification_events_date_range CHECK (valid_until >= event_date)
);

CREATE TABLE document_files (
  id BIGSERIAL PRIMARY KEY,
  document_id bigint NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  uploaded_by_user_id bigint REFERENCES users(id) ON DELETE SET NULL,
  version_no integer NOT NULL,
  mime_type character varying(100) NOT NULL,
  original_file_name character varying(255) NOT NULL,
  storage_kind document_storage_kind_enum NOT NULL DEFAULT 'LOCAL_PATH',
  storage_path character varying(500),
  content_bytea bytea,
  file_size_bytes bigint,
  sha256_hex character varying(64),
  page_count integer,
  scanned_at timestamptz,
  ocr_status document_ocr_status_enum NOT NULL DEFAULT 'NOT_REQUESTED',
  ocr_text text,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_document_files_document_version UNIQUE (document_id, version_no),
  CONSTRAINT chk_document_files_version_positive CHECK (version_no > 0),
  CONSTRAINT chk_document_files_page_count_positive CHECK (
    page_count IS NULL OR page_count > 0
  ),
  CONSTRAINT chk_document_files_file_size_non_negative CHECK (
    file_size_bytes IS NULL OR file_size_bytes >= 0
  ),
  CONSTRAINT chk_document_files_storage_payload CHECK (
    (storage_kind = 'DATABASE' AND content_bytea IS NOT NULL) OR
    (storage_kind IN ('LOCAL_PATH', 'OBJECT_STORAGE') AND storage_path IS NOT NULL)
  )
);

ALTER TABLE verification_events
ADD CONSTRAINT fk_verification_events_source_document_id
FOREIGN KEY (source_document_id)
REFERENCES documents(id)
ON DELETE SET NULL;

CREATE INDEX idx_users_party_id
  ON users (party_id);

CREATE INDEX idx_vehicles_regime
  ON vehicles (regime);

CREATE INDEX idx_vehicles_schedule_marker_effective
  ON vehicles (schedule_marker_effective);

CREATE INDEX idx_vehicle_party_roles_vehicle_id
  ON vehicle_party_roles (vehicle_id);

CREATE INDEX idx_vehicle_party_roles_party_id
  ON vehicle_party_roles (party_id);

CREATE INDEX idx_vehicle_party_roles_role_type
  ON vehicle_party_roles (role_type);

CREATE UNIQUE INDEX uq_vehicle_party_roles_current_singleton
  ON vehicle_party_roles (vehicle_id, role_type)
  WHERE is_current = true;

CREATE INDEX idx_verification_centers_center_type
  ON verification_centers (center_type);

CREATE INDEX idx_verification_centers_is_active
  ON verification_centers (is_active);

CREATE INDEX idx_verification_events_vehicle_id
  ON verification_events (vehicle_id);

CREATE INDEX idx_verification_events_center_id
  ON verification_events (center_id);

CREATE INDEX idx_verification_events_type
  ON verification_events (verification_type);

CREATE INDEX idx_verification_events_valid_until
  ON verification_events (valid_until);

CREATE INDEX idx_verification_events_result_status
  ON verification_events (result_status);

CREATE INDEX idx_verification_events_source_document_id
  ON verification_events (source_document_id);

CREATE INDEX idx_documents_vehicle_id
  ON documents (vehicle_id);

CREATE INDEX idx_documents_related_party_id
  ON documents (related_party_id);

CREATE INDEX idx_documents_uploaded_by_user_id
  ON documents (uploaded_by_user_id);

CREATE INDEX idx_documents_document_type
  ON documents (document_type);

CREATE INDEX idx_documents_verification_type
  ON documents (verification_type);

CREATE INDEX idx_documents_valid_until
  ON documents (valid_until);

CREATE INDEX idx_documents_document_status
  ON documents (document_status);

CREATE UNIQUE INDEX uq_documents_active_official_per_vehicle
  ON documents (vehicle_id, document_type)
  WHERE document_status = 'ACTIVE';

CREATE INDEX idx_document_files_document_id
  ON document_files (document_id);

CREATE INDEX idx_document_files_uploaded_by_user_id
  ON document_files (uploaded_by_user_id);

CREATE INDEX idx_document_files_storage_kind
  ON document_files (storage_kind);

CREATE INDEX idx_document_files_sha256_hex
  ON document_files (sha256_hex);

CREATE INDEX idx_document_files_is_current
  ON document_files (is_current);

CREATE UNIQUE INDEX uq_document_files_current_per_document
  ON document_files (document_id)
  WHERE is_current = true;

CREATE TRIGGER trg_parties_set_updated_at
BEFORE UPDATE ON parties
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vehicles_set_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vehicle_party_roles_set_updated_at
BEFORE UPDATE ON vehicle_party_roles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_verification_centers_set_updated_at
BEFORE UPDATE ON verification_centers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_verification_events_set_updated_at
BEFORE UPDATE ON verification_events
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_documents_set_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_document_files_set_updated_at
BEFORE UPDATE ON document_files
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
