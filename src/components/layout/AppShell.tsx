// @ts-nocheck
import { type ReactNode } from "react";
import { SideNav, useSidebarState } from "./SideNav";
import { ShellTopBar } from "./ShellTopBar";
import { WorkspaceBar } from "./WorkspaceBar";

export function AppShell({ children }: { children: ReactNode }) {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebarState();

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-background">
      <SideNav
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ShellTopBar onOpenMenu={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full min-w-0 max-w-[1600px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            <WorkspaceBar />
            {children}
          </div>
        </main>
      </div>
    </div>

  );
}
