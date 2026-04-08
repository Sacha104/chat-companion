import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, PanelLeftClose, PanelLeft, Zap, Copy, Check, LogOut, Code, Image as ImageIcon, Coins, Globe, FileText, Download, Video } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { toast } from "sonner";
import ChatSidebar from "@/components/ChatSidebar";
import ChatInput, { type Attachment } from "@/components/ChatInput";
import PromptExecutor, { type ExecutionResult } from "@/components/PromptExecutor";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isPrompt?: boolean;
  attachments?: Attachment[];
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

// Convert File to base64 string
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:xxx;base64, prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t("chat_copied"));
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
  const { t, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [executionResults, setExecutionResults] = useState<Record<string, ExecutionResult>>({});
  const [executingMsgId, setExecutingMsgId] = useState<string | null>(null);
  // Store attachments per prompt message for later execution
  const [promptAttachments, setPromptAttachments] = useState<Record<string, Attachment[]>>({});

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
    setPromptAttachments({});
    const { data } = await supabase
      .from("messages")
      .select("id, role, content, metadata")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    if (data) {
      setMessages(data.map(m => ({ ...m, role: m.role as "user" | "assistant" })));
      // Restore execution results from metadata
      const restored: Record<string, ExecutionResult> = {};
      for (const m of data) {
        if (m.metadata && typeof m.metadata === "object" && (m.metadata as any).executionResult) {
          restored[m.id] = (m.metadata as any).executionResult;
        }
      }
      setExecutionResults(restored);
    }
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

  const saveMessage = async (conversationId: string, role: string, content: string): Promise<string | null> => {
    if (!user) return null;
    const { data, error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role,
      content,
    }).select("id").single();
    if (error) { console.error("Error saving message:", error); return null; }
    return data.id;
  };

  const handleSend = async (content: string, attachments: Attachment[]) => {
    const displayContent = attachments.length > 0
      ? `${content}${content ? "\n" : ""}${attachments.map(a => `📎 ${a.file.name}`).join("\n")}`
      : content;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: displayContent, attachments };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setExecutionResults({});
    setExecutingMsgId(null);

    let convId = activeConvId;
    if (!convId) {
      convId = await createConversation(content || attachments[0]?.file.name || "Nouvelle discussion");
      if (!convId) { toast.error(t("chat_conv_error")); setIsLoading(false); return; }
      setActiveConvId(convId);
    }

    await saveMessage(convId, "user", displayContent);

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
      if (credits !== null && credits < 1) {
        toast.error(t("chat_no_credits"));
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setIsLoading(false);
        return;
      }

      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      // Build messages for the chat API – include attachment info in context
      const chatMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Add attachment context if present
      const hasAttachments = attachments.length > 0;
      let attachmentContext = "";
      if (hasAttachments) {
        const fileDescs = attachments.map(a =>
          `- ${a.file.name} (${a.type === "image" ? "image" : "document"}, ${a.type === "image" ? a.file.type : a.file.type})`
        ).join("\n");
        attachmentContext = `\n\n[L'utilisateur a joint les fichiers suivants. Le prompt optimisé DOIT inclure des instructions pour traiter/analyser ces fichiers :\n${fileDescs}]`;
      }

      // Append attachment context to the last user message for the AI
      if (attachmentContext && chatMessages.length > 0) {
        const lastIdx = chatMessages.length - 1;
        chatMessages[lastIdx] = {
          ...chatMessages[lastIdx],
          content: chatMessages[lastIdx].content + attachmentContext,
        };
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: chatMessages,
          provider: "openai",
        }),
      });

      if (resp.status === 402) {
        toast.error(t("chat_no_credits"));
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setIsLoading(false);
        refetchCredits();
        return;
      }

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
        const dbId = await saveMessage(convId, "assistant", assistantSoFar);
        // Replace the temp client ID with the real DB ID so execution results can be persisted
        if (dbId) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, id: dbId } : m))
          );
          assistantMsgId = dbId;
        }
        await supabase
          .from("conversations")
          .update({
            title: updatedMessages.length === 1 ? (content || attachments[0]?.file.name || "").slice(0, 80) : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq("id", convId);
        loadConversations();
        refetchCredits();

        // Store attachments keyed to the assistant message ID so PromptExecutor can use them
        if (attachments.length > 0) {
          setPromptAttachments((prev) => ({ ...prev, [assistantMsgId]: attachments }));
        }
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      toast.error(e.message || t("chat_stream_error"));
      if (!assistantSoFar) setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecutionResult = (msgId: string, result: ExecutionResult) => {
    setExecutingMsgId(msgId);
    setExecutionResults((prev) => ({ ...prev, [msgId]: result }));
  };

  const handleExecutionComplete = async (msgId: string, result: ExecutionResult) => {
    // Persist final execution result to DB
    try {
      await supabase
        .from("messages")
        .update({ metadata: { executionResult: result } as any })
        .eq("id", msgId);
    } catch (e) {
      console.error("Failed to save execution result:", e);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConvId(null);
    setExecutionResults({});
    setExecutingMsgId(null);
    setPromptAttachments({});
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
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
            >
              <Globe className="h-3.5 w-3.5" />
              {t("lang_switch")}
            </button>
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
              title={t("settings_signout")}
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
                {t("chat_empty_title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs text-center">
                {t("chat_empty_desc")}
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={msg.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%]">
                        {/* Show attachment thumbnails in user message */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mb-2 flex flex-wrap gap-2 justify-end">
                            {msg.attachments.map((att, j) => (
                              <div key={j} className="rounded-xl overflow-hidden border border-border">
                                {att.type === "image" && att.preview ? (
                                  <img src={att.preview} alt={att.file.name} className="h-20 w-20 object-cover" />
                                ) : (
                                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 text-xs text-muted-foreground">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="max-w-[100px] truncate">{att.file.name}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="rounded-2xl rounded-br-md bg-chat-user px-4 py-2.5 text-sm text-foreground">
                          {msg.content.split("\n").map((line, k) =>
                            line.startsWith("📎") ? (
                              <span key={k} className="block text-xs text-muted-foreground">{line}</span>
                            ) : (
                              <span key={k} className="block">{line}</span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="group/msg relative max-w-[85%] rounded-2xl rounded-tl-md bg-chat-ai px-4 py-2.5 text-sm text-foreground leading-relaxed">
                          <MarkdownRenderer content={msg.content} />
                          {!isLoading && <CopyButton text={msg.content} />}
                          {isLoading && msg === messages[messages.length - 1] && (
                            <span className="ml-1 inline-block h-3 w-1.5 animate-pulse rounded-full bg-primary/60" />
                          )}
                        </div>

                        {msg.role === "assistant" && !isLoading && (
                          <>
                            <PromptExecutor
                              prompt={msg.content}
                              attachments={promptAttachments[msg.id]}
                              onExecutionResult={(result) => handleExecutionResult(msg.id, result)}
                              onExecutionComplete={(result) => handleExecutionComplete(msg.id, result)}
                              onCreditsChanged={refetchCredits}
                            />

                            {executionResults[msg.id] && (
                              <div className="mt-3 animate-fade-up">
                                <div className="rounded-xl border border-border bg-card p-4">
                                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
                                    {executionResults[msg.id].type === "image" ? (
                                      <ImageIcon className="h-3.5 w-3.5" />
                                    ) : executionResults[msg.id].type === "video" ? (
                                      <Video className="h-3.5 w-3.5" />
                                    ) : executionResults[msg.id].type === "code" ? (
                                      <Code className="h-3.5 w-3.5" />
                                    ) : (
                                      <Sparkles className="h-3.5 w-3.5" />
                                    )}
                                    {t("chat_result")} — {executionResults[msg.id].provider}
                                  </div>

                                  {executionResults[msg.id].type === "image" && (
                                    <div className="rounded-lg overflow-hidden relative group/media">
                                      <img
                                        src={executionResults[msg.id].imageData || executionResults[msg.id].imageUrl}
                                        alt="Generated"
                                        className="max-w-full rounded-lg"
                                      />
                                      <a
                                        href={executionResults[msg.id].imageData || executionResults[msg.id].imageUrl}
                                        download={`tornado-image-${msg.id}.png`}
                                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm border border-border text-muted-foreground opacity-0 group-hover/media:opacity-100 transition-all hover:text-foreground hover:bg-background"
                                        title="Télécharger"
                                      >
                                        <Download className="h-4 w-4" />
                                      </a>
                                    </div>
                                  )}

                                  {executionResults[msg.id].type === "video" && executionResults[msg.id].imageUrl && (
                                    <div className="rounded-lg overflow-hidden relative group/media">
                                      <video
                                        src={executionResults[msg.id].imageUrl}
                                        controls
                                        className="max-w-full rounded-lg"
                                      />
                                      <a
                                        href={executionResults[msg.id].imageUrl}
                                        download={`tornado-video-${msg.id}.mp4`}
                                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm border border-border text-muted-foreground opacity-0 group-hover/media:opacity-100 transition-all hover:text-foreground hover:bg-background"
                                        title="Télécharger"
                                      >
                                        <Download className="h-4 w-4" />
                                      </a>
                                    </div>
                                  )}

                                  {(executionResults[msg.id].type === "text" || executionResults[msg.id].type === "code") && (
                                    <div className="group/result relative">
                                      {executionResults[msg.id].type === "code" ? (
                                        <pre className="whitespace-pre-wrap bg-secondary/50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                                          {executionResults[msg.id].content}
                                        </pre>
                                      ) : (
                                        <MarkdownRenderer content={executionResults[msg.id].content || ""} />
                                      )}
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
