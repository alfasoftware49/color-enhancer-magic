// @ts-nocheck
/**
 * INTERNAL CHAT MODULE
 * Real enterprise chat workspace (Supabase-backed: conversations, immutable
 * messages, attachments, mentions, reactions, receipts, presence, translation).
 */
import { ChatWorkspace } from "@/components/chat/user/ChatWorkspace";

const InternalChatPage = () => {
  return (
    <div className="h-[calc(100dvh-9rem)] min-h-[520px] w-full overflow-hidden [&>main]:h-full">
      <ChatWorkspace />
    </div>
  );
};

export default InternalChatPage;
