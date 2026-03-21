import { useState } from "react";
import { Sparkles, PanelLeftClose, PanelLeft } from "lucide-react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatInput from "@/components/ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const DEMO_CONVERSATIONS = [
  { id: "1", title: "Comment fonctionne React ?", date: "today" },
  { id: "2", title: "Recette de gâteau au chocolat", date: "today" },
  { id: "3", title: "Idées de projets side-project", date: "yesterday" },
  { id: "4", title: "Explication des closures JS", date: "yesterday" },
  { id: "5", title: "Plan de voyage au Japon", date: "older" },
];

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);

  const handleSend = (content: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Merci pour votre message ! Je suis une démo d'interface — la logique IA n'est pas encore connectée.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConv(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        conversations={DEMO_CONVERSATIONS}
        activeId={activeConv}
        onSelect={setActiveConv}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
      />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex h-12 items-center gap-2 border-b border-border px-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center animate-fade-up">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground" style={{ lineHeight: '1.1' }}>
                Comment puis-je vous aider ?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs text-center">
                Posez-moi une question, demandez une analyse ou explorez des idées.
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-chat-user px-4 py-2.5 text-sm text-foreground">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-chat-ai px-4 py-2.5 text-sm text-foreground leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chat;
