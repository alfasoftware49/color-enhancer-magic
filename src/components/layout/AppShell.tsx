// @ts-nocheck
import { type ReactNode } from "react";
import { SideNav, useSidebarState } from "./SideNav";
import { ShellTopBar } from "./ShellTopBar";
import { WorkspaceBar } from "./WorkspaceBar";
import { ChatLauncher } from "@/components/chat/ChatLauncher";


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
          <div className="mx-auto w-full min-w-0 max-w-[1760px] px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
            <WorkspaceBar />
            {children}
          </div>
        </main>
      </div>
      <ChatLauncher />
    </div>


  );
}
