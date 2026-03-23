import { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-6">
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-chat-input p-2 shadow-lg shadow-black/10 transition-shadow focus-within:ring-2 focus-within:ring-primary/30">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat_placeholder")}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 scrollbar-thin"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:brightness-110 active:scale-[0.93] disabled:opacity-30 disabled:hover:brightness-100"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground/50">
        {t("chat_disclaimer")}
      </p>
    </div>
  );
};

export default ChatInput;
