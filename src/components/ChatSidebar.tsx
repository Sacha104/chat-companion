import { Plus, MessageSquare, Settings, User } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  date: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
}

const ChatSidebar = ({ conversations, activeId, onSelect, onNewChat, isOpen }: ChatSidebarProps) => {
  if (!isOpen) return null;

  const grouped = {
    today: [] as Conversation[],
    yesterday: [] as Conversation[],
    older: [] as Conversation[],
  };

  conversations.forEach((c) => {
    if (c.date === "today") grouped.today.push(c);
    else if (c.date === "yesterday") grouped.yesterday.push(c);
    else grouped.older.push(c);
  });

  const Section = ({ label, items }: { label: string; items: Conversation[] }) =>
    items.length > 0 ? (
      <div className="mb-4">
        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </p>
        {items.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors active:scale-[0.97] ${
              activeId === c.id
                ? "bg-sidebar-active text-foreground"
                : "text-sidebar-fg hover:bg-sidebar-hover"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="truncate">{c.title}</span>
          </button>
        ))}
      </div>
    ) : null;

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar-bg border-r border-sidebar-border animate-fade-in">
      {/* New chat button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="group flex w-full items-center gap-2.5 rounded-lg border border-border/60 px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-sidebar-hover active:scale-[0.97]"
        >
          <Plus className="h-4 w-4 text-primary" />
          Nouvelle discussion
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
        <Section label="Aujourd'hui" items={grouped.today} />
        <Section label="Hier" items={grouped.yesterday} />
        <Section label="Plus ancien" items={grouped.older} />
      </div>

      {/* User / Settings */}
      <div className="border-t border-sidebar-border p-3">
        <button className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-fg transition-colors hover:bg-sidebar-hover active:scale-[0.97]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="flex-1 text-left truncate">Mon compte</span>
          <Settings className="h-4 w-4 opacity-40 group-hover:opacity-70 transition-opacity" />
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
