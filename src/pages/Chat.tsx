import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, PanelLeftClose, PanelLeft, Zap, Copy, Check, LogOut, Code, Image as ImageIcon, Coins } from "lucide-react";
import { toast } from "sonner";
import ChatSidebar from "@/components/ChatSidebar";
import ChatInput from "@/components/ChatInput";
import PromptExecutor, { type ExecutionResult } from "@/components/PromptExecutor";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isPrompt?: boolean; // marks an assistant message as a generated prompt
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copié !");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute -bottom-3 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-secondary border border-border text-muted-foreground opacity-0 group-hover/msg:opacity-100 transition-all hover:text-foreground active:scale-[0.93]"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Chat = () => {
  const { user, signOut } = useAuth();
  const { credits, refetch: refetchCredits } = useCredits();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Execution state
  const [executionResults, setExecutionResults] = useState<Record<string, ExecutionResult>>({});
  const [executingMsgId, setExecutingMsgId] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at")
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelectConversation = async (id: string) => {
    setActiveConvId(id);
    setExecutionResults({});
    setExecutingMsgId(null);
    const { data } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    if (data) setMessages(data.map(m => ({ ...m, role: m.role as "user" | "assistant" })));
  };

  const createConversation = async (title: string): Promise<string | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: title.slice(0, 80) })
      .select("id")
      .single();
    if (error) { console.error("Error creating conversation:", error); return null; }
    return data.id;
  };

  const saveMessage = async (conversationId: string, role: string, content: string) => {
    if (!user) return;
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role,
      content,
    });
  };

  const handleSend = async (content: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setExecutionResults({});
    setExecutingMsgId(null);

    let convId = activeConvId;
    if (!convId) {
      convId = await createConversation(content);
      if (!convId) { toast.error("Erreur lors de la création de la conversation"); setIsLoading(false); return; }
      setActiveConvId(convId);
    }

    await saveMessage(convId, "user", content);

    let assistantSoFar = "";
    let assistantMsgId = (Date.now() + 1).toString();

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id === assistantMsgId) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { id: assistantMsgId, role: "assistant", content: assistantSoFar, isPrompt: true }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          provider: "openai",
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(err.error || `Erreur ${resp.status}`);
      }
      if (!resp.body) throw new Error("Pas de stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) upsertAssistant(delta);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (assistantSoFar) {
        await saveMessage(convId, "assistant", assistantSoFar);
        await supabase
          .from("conversations")
          .update({
            title: updatedMessages.length === 1 ? content.slice(0, 80) : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq("id", convId);
        loadConversations();
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      toast.error(e.message || "Erreur lors de la communication avec l'IA");
      if (!assistantSoFar) setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecutionResult = (msgId: string, result: ExecutionResult) => {
    setExecutingMsgId(msgId);
    setExecutionResults((prev) => ({ ...prev, [msgId]: result }));
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConvId(null);
    setExecutionResults({});
    setExecutingMsgId(null);
  };

  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const sidebarConvs = conversations.map((c) => {
    const d = new Date(c.created_at).toDateString();
    return {
      id: c.id,
      title: c.title,
      date: d === todayStr ? "today" : d === yesterdayStr ? "yesterday" : "older",
    };
  });

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        conversations={sidebarConvs}
        activeId={activeConvId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center justify-between border-b border-border px-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              <span>{credits ?? "–"}</span>
            </div>
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 active:scale-[0.96]"
            >
              <Zap className="h-3.5 w-3.5" />
              Upgrade
            </button>
            <button
              onClick={signOut}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center animate-fade-up">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground" style={{ lineHeight: "1.1" }}>
                Décrivez ce que vous voulez
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs text-center">
                Je génère un prompt optimisé, puis vous pouvez l'exécuter directement avec l'IA de votre choix.
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={msg.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
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
                      <div className="flex-1 min-w-0">
                        <div className="group/msg relative max-w-[85%] rounded-2xl rounded-tl-md bg-chat-ai px-4 py-2.5 text-sm text-foreground leading-relaxed">
                          <pre className="whitespace-pre-wrap font-[inherit]">{msg.content}</pre>
                          {!isLoading && <CopyButton text={msg.content} />}
                          {isLoading && msg === messages[messages.length - 1] && (
                            <span className="ml-1 inline-block h-3 w-1.5 animate-pulse rounded-full bg-primary/60" />
                          )}
                        </div>

                        {/* Show AI execution panel after prompt is done generating */}
                        {msg.role === "assistant" && !isLoading && (
                          <>
                            <PromptExecutor
                              prompt={msg.content}
                              onExecutionResult={(result) => handleExecutionResult(msg.id, result)}
                            />

                            {/* Execution result */}
                            {executionResults[msg.id] && (
                              <div className="mt-3 animate-fade-up">
                                <div className="rounded-xl border border-border bg-card p-4">
                                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
                                    {executionResults[msg.id].type === "image" ? (
                                      <ImageIcon className="h-3.5 w-3.5" />
                                    ) : executionResults[msg.id].type === "code" ? (
                                      <Code className="h-3.5 w-3.5" />
                                    ) : (
                                      <Sparkles className="h-3.5 w-3.5" />
                                    )}
                                    Résultat — {executionResults[msg.id].provider}
                                  </div>

                                  {/* Image result */}
                                  {executionResults[msg.id].type === "image" && (
                                    <div className="rounded-lg overflow-hidden">
                                      <img
                                        src={executionResults[msg.id].imageData || executionResults[msg.id].imageUrl}
                                        alt="Generated"
                                        className="max-w-full rounded-lg"
                                      />
                                    </div>
                                  )}

                                  {/* Text result */}
                                  {(executionResults[msg.id].type === "text" || executionResults[msg.id].type === "code") && (
                                    <div className="group/result relative">
                                      <pre className={`whitespace-pre-wrap text-sm leading-relaxed ${
                                        executionResults[msg.id].type === "code"
                                          ? "bg-secondary/50 rounded-lg p-3 font-mono text-xs overflow-x-auto"
                                          : "font-[inherit]"
                                      }`}>
                                        {executionResults[msg.id].content}
                                      </pre>
                                      {executionResults[msg.id].content && (
                                        <CopyButton text={executionResults[msg.id].content!} />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 animate-fade-up">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-chat-ai px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Chat;
