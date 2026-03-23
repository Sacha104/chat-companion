import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Settings, User, Menu, Building2, Bot } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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
      <div className="p-3 space-y-2">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-hover transition-colors active:scale-[0.95]"
          >
            <Menu className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-10 z-50 w-48 rounded-xl border border-border bg-popover p-1 shadow-xl shadow-black/20 animate-fade-up"
              style={{ animationDuration: "200ms" }}
            >
              <button
                onClick={() => { setMenuOpen(false); navigate("/company"); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-secondary transition-colors active:scale-[0.97]"
              >
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {t("sidebar_company")}
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/our-ais"); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-secondary transition-colors active:scale-[0.97]"
              >
                <Bot className="h-4 w-4 text-muted-foreground" />
                {t("sidebar_our_ais")}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onNewChat}
          className="group flex w-full items-center gap-2.5 rounded-lg border border-border/60 px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-sidebar-hover active:scale-[0.97]"
        >
          <Plus className="h-4 w-4 text-primary" />
          {t("sidebar_new_chat")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
        <Section label={t("sidebar_today")} items={grouped.today} />
        <Section label={t("sidebar_yesterday")} items={grouped.yesterday} />
        <Section label={t("sidebar_older")} items={grouped.older} />
      </div>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => navigate("/settings")}
          className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-fg transition-colors hover:bg-sidebar-hover active:scale-[0.97]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="flex-1 text-left truncate">{t("sidebar_account")}</span>
          <Settings className="h-4 w-4 opacity-40 group-hover:opacity-70 transition-opacity" />
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
