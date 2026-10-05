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
