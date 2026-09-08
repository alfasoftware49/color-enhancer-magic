/**
 * ROLE → DASHBOARD REGISTRY
 * Maps every Control Panel sidebar module to its full dashboard.
 * Chunks are code-split but can be warmed up ahead of the click
 * (hover / focus / idle) so opening a module feels instant.
 */
import { lazy, Suspense, useEffect, type ComponentType } from "react";
import type { RoleId } from "./ControlPanelSidebar";

const noop = () => {};

type Loader = () => Promise<{ default: ComponentType<any> }>;

const workspace = (role: string): Loader => async () => {
  const m = await import("@/components/dashboard/RoleWorkspace");
  return { default: () => <m.RoleWorkspace role={role as never} /> };
};

const lazyDefault = (loader: Loader): Loader => loader;

const ROLE_LOADERS: Partial<Record<RoleId, Loader>> = {
  // GRADE 1
  ceo: lazyDefault(() => import("@/pages/ai-ceo/AICEODashboard")),
  vala_ai_management: lazyDefault(() => import("@/pages/OverAI")),
  server_manager: lazyDefault(() => import("@/pages/server-manager/ServerManagerDashboard")),
  api_ai_manager: lazyDefault(() => import("@/pages/ai-api-management/AIAPIManagementDashboard")),
  // GRADE 2
  developer_management: lazyDefault(() => import("@/pages/dev-manager/SecureDevManagerDashboard")),
  product_manager: lazyDefault(() => import("@/pages/product-demo-manager/ProductDashboard")),
  demo_manager: lazyDefault(() => import("@/pages/DemoManagerDashboard")),
  task_management: lazyDefault(() => import("@/pages/TaskManager")),
  promise_tracker_manager: lazyDefault(() => import("@/pages/promise-tracker/PromiseTrackerDashboard")),
  assist_manager: lazyDefault(() => import("@/pages/assist-manager/AssistManagerDashboard")),
  ams_manager: (async () => {
    const m = await import("@/components/dashboard/AMSCenterWorkspace");
    return { default: () => <m.AMSCenterWorkspace onBack={noop} /> };
  }),
  award_management: (async () => {
    const [m, roles] = await Promise.all([
      import("@/components/dashboard/AMSWorkspace"),
      import("@/lib/roles"),
    ]);
    return { default: () => <m.AMSWorkspace role={roles.ROLES.admin} onBack={noop} /> };
  }),
  auto_dev: lazyDefault(() => import("@/pages/auto-dev/AutoDevDashboard")),
  // GRADE 3
  marketing_management: lazyDefault(() => import("@/pages/MarketingManager")),
  seo_manager: lazyDefault(() => import("@/pages/seo-manager/SEOManagerDashboard")),
  lead_manager: lazyDefault(() => import("@/pages/LeadManager")),
  sales_support_manager: lazyDefault(() => import("@/pages/SalesSupportDashboard")),
  customer_support_management: lazyDefault(() => import("@/pages/SupportDashboard")),
  sales_crm: lazyDefault(() => import("@/pages/sales-crm/SalesCRMDashboard")),
  client_success: lazyDefault(() => import("@/pages/ClientSuccessDashboard")),
  internal_support_ai: lazyDefault(() => import("@/pages/InternalSupportAI")),
  notification_console: lazyDefault(() => import("@/pages/NotificationBuzzerConsole")),
  // GRADE 4
  franchise_manager: lazyDefault(() => import("@/pages/FranchiseManagement")),
  reseller_manager: lazyDefault(() => import("@/pages/reseller-manager/SecureResellerManagerDashboard")),
  influencer_manager: lazyDefault(() => import("@/pages/InfluencerManager")),
  influencer_dashboard: lazyDefault(() => import("@/pages/InfluencerDashboard")),
  multi_branch: lazyDefault(() => import("@/pages/multi-branch/MultiBranchDashboard")),
  // GRADE 5
  continent_super_admin: lazyDefault(() => import("@/pages/continent-super-admin/ContinentSuperAdminDashboard")),
  country_head: lazyDefault(() => import("@/components/country-dashboard/CountryHeadDashboard")),
  // GRADE 6
  finance_manager: lazyDefault(() => import("@/pages/FinanceManager")),
  accounting_manager: lazyDefault(() => import("@/pages/accounting/AccountingDemo")),
  legal_manager: lazyDefault(() => import("@/pages/LegalComplianceManager")),
  developer_dashboard: lazyDefault(() => import("@/pages/DeveloperDashboard")),
  pro_manager: lazyDefault(() => import("@/pages/pro-manager/SecureProManagerDashboard")),
  hr_manager: lazyDefault(() => import("@/pages/hr-manager/SecureHRManagerDashboard")),
  performance_manager: lazyDefault(() => import("@/pages/PerformanceManager")),
  rnd_manager: lazyDefault(() => import("@/pages/RnDDashboard")),
  incident_crisis: lazyDefault(() => import("@/pages/IncidentCrisisDashboard")),
  business_dashboard: lazyDefault(() => import("@/pages/business/BusinessDashboard")),
  api_manager: lazyDefault(() => import("@/pages/api-manager/APIManagerDashboard")),
  server_orchestration: lazyDefault(() => import("@/pages/server-orchestration/ServerOrchestrationDashboard")),
  enterprise_control: lazyDefault(() => import("@/pages/enterprise-control/EnterpriseControlHub")),
  master_control: lazyDefault(() => import("@/pages/master-control/MasterControlCenter")),
  // GRADE 6.5 — PLATFORM MODULES
  marketplace_manager: lazyDefault(() => import("@/pages/super-admin/ProductManagerPage")),
  super_admin_system: lazyDefault(() => import("@/pages/super-admin-system/RoleSwitch/RoleSwitchDashboard")),
  vala_control: (async () => {
    const m = await import("@/pages/vala-control/ValaControlCenter");
    return { default: () => <m.default roleView="operations" /> };
  }),
  safe_assist: lazyDefault(() => import("@/pages/safe-assist/SafeAssistDashboard")),
  promise_management: lazyDefault(() => import("@/pages/promise-management/PromiseManagementDashboard")),
  dev_command_center: lazyDefault(() => import("@/pages/DevCommandCenter")),
  internal_chat: lazyDefault(() => import("@/pages/InternalChat")),
  client_portal: lazyDefault(() => import("@/pages/ClientPortal")),
  school_software: lazyDefault(() => import("@/pages/school-software/SchoolSoftwareHomepage")),
  retail_pos: lazyDefault(() => import("@/pages/retail-pos/RetailPOSDemo")),
  // GRADE 6.6 — PARTNER WORKSPACES (/dashboard/$role in the source repo)
  ws_author: workspace("author"),
  ws_vendor: workspace("vendor"),
  ws_reseller: workspace("reseller"),
  ws_affiliate: workspace("affiliate"),
  ws_influencer: workspace("influencer"),
  ws_franchise: workspace("franchise"),
  ws_seo: workspace("seo"),
  ws_admin: workspace("admin"),
  ws_developer: workspace("developer"),
  ws_dev_manager: workspace("dev-manager"),
  ws_promise_tracker: workspace("promise-tracker"),
  // GRADE 7
  pro_user_dashboard: lazyDefault(() => import("@/pages/prime/PrimeDashboardPage")),
  basic_user_dashboard: lazyDefault(() => import("@/pages/SimpleUserDashboard")),
  // GRADE 8
  home: lazyDefault(() => import("@/pages/Homepage")),
  security: lazyDefault(() => import("@/pages/security-command/SecurityCommandCenter")),
  settings: lazyDefault(() => import("@/pages/Settings")),
};

const CACHE = new Map<string, Promise<{ default: ComponentType<any> }>>();

/** Warm a module chunk before the user clicks it. */
export function preloadRoleDashboard(role: string) {
  const loader = ROLE_LOADERS[role as RoleId];
  if (!loader) return;
  if (!CACHE.has(role)) CACHE.set(role, loader().catch(() => ({ default: () => null })));
}

export const ROLE_DASHBOARDS: Partial<Record<RoleId, ComponentType<any>>> = Object.fromEntries(
  Object.entries(ROLE_LOADERS).map(([role, loader]) => [
    role,
    lazy(() => {
      preloadRoleDashboard(role);
      return CACHE.get(role)!;
    }),
  ]),
) as Partial<Record<RoleId, ComponentType<any>>>;

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 sm:p-6" aria-busy="true" aria-live="polite">
      <div className="h-9 w-64 rounded-lg bg-foreground/10" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-foreground/[0.07]" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-foreground/[0.06]" />
    </div>
  );
}

export function RoleDashboard({ role }: { role: RoleId }) {
  const Dashboard = ROLE_DASHBOARDS[role];

  // Warm the neighbouring modules once this one is on screen.
  useEffect(() => {
    const ids = Object.keys(ROLE_LOADERS);
    const idx = ids.indexOf(role);
    const near = [ids[idx + 1], ids[idx - 1]].filter(Boolean) as string[];
    const run = () => near.forEach(preloadRoleDashboard);
    const w = window as any;
    const id = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 2000 }) : window.setTimeout(run, 1200);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id));
  }, [role]);

  if (!Dashboard) return null;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {/* Render the original page exactly as it is in the source repo — no extra chrome. */}
      <Dashboard />
    </Suspense>
  );
}
