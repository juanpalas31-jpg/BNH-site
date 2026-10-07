-- Portable Lead Engine v1
-- Provider-neutral relational schema. PostgreSQL-compatible baseline.

create table if not exists tenants (
  tenant_id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  project_id text primary key,
  tenant_id text not null references tenants(tenant_id),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  lead_id text primary key,
  tenant_id text not null references tenants(tenant_id),
  project_id text not null references projects(project_id),
  session_id text,
  received_at timestamptz not null,
  nom text,
  telephone text,
  email text,
  code_postal text,
  source text,
  canal text,
  campagne text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  content_page text,
  statut text,
  date_rdv timestamptz,
  resultat text,
  montant_devis numeric(12,2),
  ca_signe numeric(12,2),
  schema_version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists events (
  event_id text primary key,
  tenant_id text not null references tenants(tenant_id),
  project_id text not null references projects(project_id),
  session_id text,
  received_at timestamptz not null,
  browser_timestamp text,
  path text,
  event text,
  source text,
  canal text,
  campagne text,
  local_day text,
  local_hour text,
  target text,
  duration_sec numeric,
  schema_version integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists leads_tenant_received_idx on leads(tenant_id, received_at);
create index if not exists leads_project_received_idx on leads(project_id, received_at);
create index if not exists leads_session_idx on leads(session_id);
create index if not exists events_tenant_received_idx on events(tenant_id, received_at);
create index if not exists events_project_received_idx on events(project_id, received_at);
create index if not exists events_session_idx on events(session_id);

insert into tenants(tenant_id,name) values ('bnh','BNH') on conflict (tenant_id) do nothing;
insert into projects(project_id,tenant_id,name) values ('bnh-site','bnh','BNH Site') on conflict (project_id) do nothing;


-- Spider Engine evolution + integrity
-- Strategy fitness memory: lets the organism compare strategies using real outcomes.
CREATE TABLE IF NOT EXISTS strategy_outcomes (
  outcome_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL REFERENCES tenants(tenant_id),
  project_id text NOT NULL REFERENCES projects(project_id),
  strategy text NOT NULL CHECK (strategy IN ('web','ambush','pursuit','interception','observe')),
  context_key text NOT NULL DEFAULT 'default',
  impressions bigint NOT NULL DEFAULT 0 CHECK (impressions >= 0),
  qualified_leads bigint NOT NULL DEFAULT 0 CHECK (qualified_leads >= 0),
  appointments bigint NOT NULL DEFAULT 0 CHECK (appointments >= 0),
  sales bigint NOT NULL DEFAULT 0 CHECK (sales >= 0),
  revenue numeric(14,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, project_id, strategy, context_key)
);

-- Regeneration memory: records verifiable engine snapshots without storing secrets.
CREATE TABLE IF NOT EXISTS engine_snapshots (
  snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL REFERENCES tenants(tenant_id),
  project_id text NOT NULL REFERENCES projects(project_id),
  dna_version text NOT NULL,
  schema_version integer NOT NULL,
  checksum text NOT NULL,
  storage_provider text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS projects_tenant_project_uidx ON projects(tenant_id, project_id);
CREATE INDEX IF NOT EXISTS strategy_outcomes_tenant_idx ON strategy_outcomes(tenant_id, project_id, strategy);
CREATE INDEX IF NOT EXISTS engine_snapshots_tenant_created_idx ON engine_snapshots(tenant_id, project_id, created_at DESC);

-- Provider-neutral schema invariant: project and tenant must always belong together.
-- Production migration also enforces this with composite foreign keys.


-- Attila durable aggregate memory v2
-- Stores operational posture and aggregate counters only. Raw PII is forbidden by application boundary.
CREATE TABLE IF NOT EXISTS attila_states (
  tenant_id text NOT NULL REFERENCES tenants(tenant_id),
  project_id text NOT NULL REFERENCES projects(project_id),
  identity text NOT NULL DEFAULT 'ATTILA_ARACHNID_AI',
  posture text NOT NULL CHECK (posture IN ('IMMOBILE','AMBUSH','SIGNAL_DETECTED','PREPARE_POUNCE','POUNCE_PROPOSAL')),
  posture_since timestamptz,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  schema_version integer NOT NULL DEFAULT 2,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, project_id)
);
CREATE INDEX IF NOT EXISTS attila_states_updated_idx ON attila_states(updated_at DESC);


-- Durable client mission continuity.
CREATE TABLE IF NOT EXISTS attila_missions (
  mission_id text PRIMARY KEY,
  client_id text NOT NULL,
  phase text NOT NULL,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS attila_missions_phase_idx ON attila_missions(phase);
