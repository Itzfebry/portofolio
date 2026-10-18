"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import { Markdown } from "@/components/ui/markdown";

type MarkdownTextareaProps = {
  name: string;
  label: string;
  rows?: number;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  textareaClassName?: string;
};

type Tool = {
  key: string;
  title: string;
  before: string;
  after: string;
  placeholder: string;
};

const TOOLS: Tool[] = [
  { key: "bold", title: "Tebal (Ctrl+B)", before: "**", after: "**", placeholder: "teks tebal" },
  { key: "italic", title: "Miring (Ctrl+I)", before: "*", after: "*", placeholder: "teks miring" },
  { key: "code", title: "Code inline (Ctrl+E)", before: "`", after: "`", placeholder: "kode" },
  { key: "block", title: "Code block / bash", before: "```bash\n", after: "\n```", placeholder: "npm run build" },
  { key: "bullet", title: "Daftar bullet", before: "\n- ", after: "", placeholder: "item" },
  {
    key: "table",
    title: "Tabel (2 kolom)",
    before: "\n\n| Kolom A | Kolom B |\n| --- | --- |\n| ",
    after: " | isi |\n\n",
    placeholder: "isi",
  },
  { key: "paragraph", title: "Paragraf baru", before: "\n\n", after: "", placeholder: "" },
];

export function MarkdownTextarea({
  name,
  label,
  rows = 5,
  required = false,
  defaultValue = "",
  placeholder,
  hint,
  textareaClassName,
}: MarkdownTextareaProps) {
  const [value, setValue] = useState(defaultValue);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyTool = (tool: Tool) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + tool.before + (selected || tool.placeholder) + tool.after + value.slice(end);

    setValue(next);

    requestAnimationFrame(() => {
      el.focus();
      if (selected || !tool.placeholder) {
        const caret = start + tool.before.length + selected.length;
        el.setSelectionRange(caret, caret);
      } else {
        el.setSelectionRange(
          start + tool.before.length,
          start + tool.before.length + tool.placeholder.length,
        );
      }
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!event.metaKey && !event.ctrlKey) return;
    const key = event.key.toLowerCase();
    const tool = TOOLS.find((item) => item.key === (key === "b" ? "bold" : key === "i" ? "italic" : key === "e" ? "code" : ""));
    if (!tool) return;
    event.preventDefault();
    applyTool(tool);
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-zinc-300">{label}</span>
        <button
          type="button"
          onClick={() => setShowPreview((prev) => !prev)}
          className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition hover:border-emerald-400/60 hover:text-emerald-300"
        >
          {showPreview ? "Sembunyikan preview" : "Preview"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-t-xl border border-b-0 border-zinc-700 bg-zinc-950/60 px-2 py-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.key}
            type="button"
            title={tool.title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyTool(tool)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300 transition hover:border-emerald-400/60 hover:text-emerald-300"
          >
            {tool.key === "paragraph"
              ? "↵↵"
              : tool.key === "block"
                ? ">_"
                : tool.key === "bullet"
                  ? "•"
                  : tool.key === "table"
                    ? "▦"
                    : tool.key === "bold"
                    ? "B"
                    : tool.key === "italic"
                      ? "I"
                      : "</>"}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        name={name}
        required={required}
        rows={rows}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={[
          "w-full rounded-b-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 font-mono text-sm leading-6 text-white outline-none focus:border-emerald-400",
          textareaClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {hint ? <p className="mt-1.5 text-xs leading-5 text-zinc-500">{hint}</p> : null}

      {showPreview ? (
        <div className="mt-3 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4 text-justify text-sm text-zinc-200">
          <Markdown text={value} className="space-y-3" />
        </div>
      ) : null}
    </div>
  );
}
