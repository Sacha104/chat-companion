import { useState, useRef, useEffect } from "react";
import { SendHorizonal, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export interface Attachment {
  file: File;
  preview: string; // data URL for images, empty for other files
  type: "image" | "document";
}

interface ChatInputProps {
  onSend: (message: string, attachments: Attachment[]) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if ((!trimmed && attachments.length === 0) || disabled) return;
    onSend(trimmed, attachments);
    setValue("");
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setAttachments((prev) => [
            ...prev,
            { file, preview: ev.target?.result as string, type: "image" },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        // For documents, read as base64 but no visual preview
        setAttachments((prev) => [
          ...prev,
          { file, preview: "", type: "document" },
        ]);
      }
    });

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-6">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="group relative flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground"
            >
              {att.type === "image" && att.preview ? (
                <img
                  src={att.preview}
                  alt={att.file.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              )}
              <span className="max-w-[120px] truncate">{att.file.name}</span>
              <button
                onClick={() => removeAttachment(i)}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 rounded-2xl border border-border bg-chat-input p-2 shadow-lg shadow-black/10 transition-shadow focus-within:ring-2 focus-within:ring-primary/30">
        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary disabled:opacity-30"
          title={t("chat_attach")}
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.json,.xml"
          onChange={handleFileSelect}
          className="hidden"
        />

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={attachments.length > 0 ? t("chat_describe_attachment") : t("chat_placeholder")}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 scrollbar-thin"
        />
        <button
          onClick={handleSubmit}
          disabled={(!value.trim() && attachments.length === 0) || disabled}
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
