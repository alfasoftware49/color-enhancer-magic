import { createFileRoute } from "@tanstack/react-router";
import { ChatWorkspace } from "@/components/chat/user/ChatWorkspace";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Team Chat — Software Vala Enterprise Communication" },
      {
        name: "description",
        content:
          "Real-time enterprise chat with immutable history, attachments, mentions, read receipts, presence and live translation.",
      },
      { property: "og:title", content: "Team Chat — Software Vala Enterprise Communication" },
      {
        property: "og:description",
        content:
          "Role-scoped enterprise messaging with attachments, mentions, receipts and live translation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatRoute,
});

function ChatRoute() {
  return (
    <div className="h-[calc(100dvh-11rem)] min-h-[520px] overflow-hidden rounded-xl border border-border/60 [&>main]:h-full">
      <ChatWorkspace />
    </div>
  );
}
