/**
 * GLOBAL CHAT LAUNCHER
 * Floating chat icon rendered on every dashboard. Shows the real unread count
 * from the chat database and opens the enterprise chat workspace.
 */
import { useMemo } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { useSupabaseSession } from "@/hooks/use-session";
import { useConversations } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

export function ChatLauncher({ className }: { className?: string }) {
  const location = useLocation();
  const { userId } = useSupabaseSession();
  const conversationsQuery = useConversations(userId);

  const unread = useMemo(
    () => (conversationsQuery.data ?? []).reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    [conversationsQuery.data],
  );

  // Never render on top of the chat surfaces themselves.
  if (location.pathname === "/chat" || location.pathname === "/m/internal_chat") return null;

  return (
    <Link
      to="/chat"
      aria-label={unread > 0 ? `Open team chat, ${unread} unread messages` : "Open team chat"}
      className={cn(
        "fixed bottom-5 right-5 z-50 grid size-12 place-items-center rounded-full border border-primary/40",
        "bg-[image:var(--gradient-primary,linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary))))]",
        "bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95",
        className,
      )}
    >
      <MessageSquare className="size-5" />
      {unread > 0 ? (
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
          {unread > 99 ? "99+" : unread}
        </span>
      ) : null}
    </Link>
  );
}

export default ChatLauncher;
