import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { supabase } from "@/services/chat/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { RoleDashboard } from "@/components/super-admin-wireframe/roleDashboards";
import { PageBanner } from "@/components/layout/PageBanner";
import { ChatLauncher } from "@/components/chat/ChatLauncher";

import { ROLE_CATEGORIES } from "@/components/super-admin-wireframe/ControlPanelSidebar";
import type { RoleId } from "@/components/super-admin-wireframe/ControlPanelSidebar";

/** Modules that expose privileged controls require a real signed-in session. */
const PROTECTED_MODULES = new Set([
  "super_admin_system",
  "internal_chat",
  "ws_author",
  "ws_vendor",
  "ws_reseller",
  "ws_affiliate",
  "ws_influencer",
  "ws_franchise",
  "ws_seo",
  "ws_admin",
  "ws_developer",
  "ws_dev_manager",
  "ws_promise_tracker",
]);

export const Route = createFileRoute("/m/$module")({
  beforeLoad: async ({ params, location }) => {
    if (!PROTECTED_MODULES.has(params.module)) return;
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [
      { title: "Module — Control Panel" },
      { name: "description", content: "Open a management module dashboard." },
      { property: "og:title", content: "Module — Control Panel" },
      { property: "og:description", content: "Open a management module dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ModulePage,
});

function ModulePage() {
  const { module } = useParams({ from: "/m/$module" });
  const label =
    ROLE_CATEGORIES.find((r) => r.id === module)?.label ?? "Module";

  return (
    <AuthProvider>
      <TranslationProvider>
        <TooltipProvider>
          {/* Original module UI, exactly as in the source repo — banner on top. */}
          <div className="ams-skin dark min-h-screen w-full overflow-x-hidden bg-background text-foreground">
            <div className="px-3 pt-3 sm:px-6 sm:pt-4">
              <PageBanner
                eyebrow="Software Vala"
                title={label}
                description="Module workspace — live operational controls."
                live
                liveLabel="module"
                compact
              />
            </div>
            {/* transform creates a containing block so the module's own
                fixed sidebar/header stay inside this area, below the banner */}
            <div
              className="relative isolate mt-3 w-full overflow-x-hidden sm:mt-4"
              style={{ transform: "translateZ(0)", contain: "layout paint" }}
            >
              <RoleDashboard role={module as RoleId} />
            </div>
          </div>

          <ChatLauncher />
        </TooltipProvider>

      </TranslationProvider>
    </AuthProvider>
  );
}
