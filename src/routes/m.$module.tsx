import { createFileRoute, useParams } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { RoleDashboard } from "@/components/super-admin-wireframe/roleDashboards";
import { AppShell } from "@/components/layout/AppShell";
import { PageBanner } from "@/components/layout/PageBanner";
import { ROLE_CATEGORIES } from "@/components/super-admin-wireframe/ControlPanelSidebar";
import type { RoleId } from "@/components/super-admin-wireframe/ControlPanelSidebar";

export const Route = createFileRoute("/m/$module")({
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
    <AppShell>
      <AuthProvider>
      <TranslationProvider>
        <TooltipProvider>
          {/* Original module UI, exactly as in the source repo — banner on top. */}
          <div className="ams-skin dark w-full overflow-x-hidden bg-background text-foreground">
            <div>
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

        </TooltipProvider>
      </TranslationProvider>
    </AuthProvider>
    </AppShell>
  );
}
