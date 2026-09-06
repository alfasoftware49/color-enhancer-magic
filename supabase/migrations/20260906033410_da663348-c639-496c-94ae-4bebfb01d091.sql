create or replace function public.update_updated_at_column() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;

create table if not exists public.workspace_kpis (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  kpi_key text not null,
  value numeric not null default 0,
  delta_pct numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (role, kpi_key)
);
grant select on public.workspace_kpis to authenticated;
grant all on public.workspace_kpis to service_role;
alter table public.workspace_kpis enable row level security;
create policy "kpis readable by authenticated" on public.workspace_kpis for select to authenticated using (true);

create table if not exists public.workspace_records (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  module text not null,
  name text not null,
  status text not null default 'active',
  owner text not null default 'unassigned',
  category text not null default 'Core',
  amount numeric not null default 0,
  occurred_at timestamptz not null default now(),
  notes text not null default '',
  tags text[] not null default '{}',
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workspace_records_role_module_idx on public.workspace_records (role, module);
grant select, insert, update, delete on public.workspace_records to authenticated;
grant all on public.workspace_records to service_role;
alter table public.workspace_records enable row level security;
create policy "records readable by authenticated" on public.workspace_records for select to authenticated using (true);
create policy "records insert by authenticated" on public.workspace_records for insert to authenticated with check (auth.uid() is not null);
create policy "records update by authenticated" on public.workspace_records for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "records delete own" on public.workspace_records for delete to authenticated using (created_by = auth.uid());

create trigger workspace_kpis_touch before update on public.workspace_kpis for each row execute function public.update_updated_at_column();
create trigger workspace_records_touch before update on public.workspace_records for each row execute function public.update_updated_at_column();

insert into public.workspace_kpis (role, kpi_key, value, delta_pct) values
('author','products',3729,20.0),('author','downloads',3838,7.6),('author','sales',1579,-0.5),('author','revenue',280387,8.3),
('author','reviews',1549,-3.2),('author','followers',2509,-1.7),
('vendor','products',367,11.9),('vendor','products-draft',3269,22.9),('vendor','inventory-oos',1314,12.7),('vendor','inventory',541,-4.2),
('vendor','orders',1582,20.4),('vendor','orders-pending',270,17.3),('vendor','orders-completed',2696,7.2),('vendor','orders-cancelled',1624,9.6),
('vendor','revenue',347697,2.8),('vendor','revenue-month',14408,13.9),('vendor','customers',3770,13.6),('vendor','customers-repeat',3356,23.9),
('vendor','returns',705,15.2),('vendor','refunds',2606,16.7),
('reseller','clients',2391,-5.1),('reseller','licenses',908,6.0),('reseller','trial-clients',2407,5.6),('reseller','expired-licenses',162,19.4),
('reseller','leads',28,0.4),('reseller','leads-won',452,8.1),('reseller','leads-lost',3279,6.6),('reseller','leads-pending',1650,17.4),
('reseller','commissions',153440,4.1),('reseller','payout-pending',175163,4.0),('reseller','revenue',226984,16.7),('reseller','renewals',65,-2.0),
('affiliate','clicks',851,-5.7),('affiliate','conversions',87,17.9),('affiliate','commissions',105154,14.5),('affiliate','campaigns',1567,7.4),
('affiliate','payouts',111973,23.6),('affiliate','rank',1096,6.6),('affiliate','marketing',3167,-2.5),('affiliate','ai',3470,23.7),
('affiliate','reports',27,2.1),
('influencer','followers',2515,23.9),('influencer','campaigns',184,0.3),('influencer','brands',3253,23.9),('influencer','content',845,-4.7),
('influencer','revenue',88734,0.4),('influencer','engagement',74,-5.7),
('franchise','branches',2718,18.9),('franchise','leads',3187,-3.8),('franchise','revenue',59247,0.3),('franchise','employees',2014,-5.5),
('franchise','performance',3044,5.2),('franchise','growth',87,-2.2),('franchise','ai',3986,19.0),('franchise','reports',1135,20.0),
('seo','projects',1521,12.8),('seo','keywords',2570,21.3),('seo','traffic',2067,15.8),('seo','backlinks',1322,16.2),
('seo','audits',1634,14.6),('seo','rankings',3204,20.5),('seo','tools',667,6.6),('seo','ai',874,-2.7),
('seo','reports',2114,1.2),
('admin','users',3232,1.7),('admin','orders',4046,2.8),('admin','revenue',103977,21.9),('admin','products',587,-2.2),
('admin','tickets',3950,10.8),('admin','approvals',631,2.4),
('developer','tasks-open',1694,16.5),('developer','tasks-done',590,2.1),('developer','bugs-open',3675,1.5),('developer','commits',405,-0.7),
('developer','code-hours',3045,9.9),('developer','performance',66,-3.2),('developer','payout',84565,20.7),('developer','streak',2735,13.7),
('dev-manager','developers',1173,11.7),('dev-manager','onboarding',170,8.2),('dev-manager','tasks',2952,15.0),('dev-manager','sprint',60,-5.4),
('dev-manager','qa-pending',637,8.5),('dev-manager','bugs',2572,3.6),('dev-manager','performance',62,-3.7),('dev-manager','payout',298311,5.0),
('dev-manager','compliance',60,21.0),('dev-manager','escalations',1085,17.8),
('promise-tracker','active',2822,4.6),('promise-tracker','fulfilled',3901,21.0),('promise-tracker','delayed',3441,22.3),('promise-tracker','broken',271,19.9),
('promise-tracker','escalations',143,12.7),('promise-tracker','sla',82,5.4),('promise-tracker','fines',18525,12.3),('promise-tracker','tips',54048,-3.3)
on conflict (role, kpi_key) do nothing;

insert into public.workspace_records (role, module, name, status, owner, category, amount, occurred_at, notes, tags)
select r.role, m.module,
  initcap(replace(m.module,'-',' '))||' #'||(1000 + m.ord*10 + i)::text,
  (array['active','active','pending','approved','draft'])[i],
  (array['Aarav Mehta','Priya Shah','Liam Cohen','Maya Patel','Noah Singh','Ava Khan','Ethan Roy','Zoya Iyer'])[1 + ((m.ord*3 + i) % 8)],
  (array['Core','Growth','Premium','Starter','Enterprise'])[1 + ((m.ord + i) % 5)],
  1250 + ((m.ord * 7 + i) * 1373) % 68000,
  now() - ((m.ord*3 + i) || ' days')::interval,
  'Live '||r.role||' '||replace(m.module,'-',' ')||' record from operations ledger.',
  array['priority','review']
from (values
('author',array['products','downloads','sales','revenue','reviews','followers']),
('vendor',array['products','orders','revenue','customers','returns','inventory']),
('reseller',array['clients','licenses','leads','commissions','revenue','renewals']),
('affiliate',array['clicks','conversions','commissions','campaigns','payouts','rank']),
('influencer',array['followers','campaigns','brands','content','revenue','engagement']),
('franchise',array['branches','leads','revenue','employees','performance','growth']),
('seo',array['projects','keywords','traffic','backlinks','audits','rankings']),
('admin',array['users','orders','revenue','products','tickets','approvals']),
('developer',array['command-center','tasks','bugs','code-submission','timer','performance']),
('dev-manager',array['overview','registry','onboarding','roles','tasks','sprint']),
('promise-tracker',array['overview','all','create','categories','sales','support'])
) as r(role, modules)
cross join lateral unnest(r.modules) with ordinality as m(module, ord)
cross join generate_series(1,5) as i;