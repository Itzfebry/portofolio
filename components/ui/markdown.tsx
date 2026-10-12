import type { ReactNode } from "react";

import { INLINE_PATTERN, parseMarkdown } from "@/lib/markdown";

type MarkdownProps = {
  text?: string | null;
  className?: string;
  paragraphClassName?: string;
};

const DEFAULT_CONTAINER = "space-y-4";
const DEFAULT_PARAGRAPH = "whitespace-pre-line";
const INLINE_CODE = "rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[0.9em] text-emerald-200";
const CODE_BLOCK =
  "overflow-x-auto rounded-2xl border border-zinc-700 bg-zinc-950/80 p-4 text-left font-mono text-sm leading-6 text-zinc-200";
/** Marker di luar (list-outside via pl) supaya rapi saat kontainer memakai text-justify. */
const BULLET_LIST = "list-disc space-y-1.5 pl-5 marker:text-emerald-400";
const ORDERED_LIST = "list-decimal space-y-1.5 pl-5 marker:text-emerald-400";

/** Render markdown aman (React node murni, tanpa innerHTML). */
export function Markdown({ text, className, paragraphClassName }: MarkdownProps) {
  const blocks = parseMarkdown(text);
  if (blocks.length === 0) return null;

  return (
    <div className={[DEFAULT_CONTAINER, className].filter(Boolean).join(" ")}>
      {blocks.map((block, index) =>
        block.type === "code" ? (
          <pre key={`b-${index}`} className={CODE_BLOCK}>
            <code>{block.code}</code>
          </pre>
        ) : block.type === "list" ? (
          block.ordered ? (
            <ol key={`b-${index}`} className={ORDERED_LIST}>
              {block.items.map((item, itemIndex) => (
                <li key={`i-${itemIndex}`}>{renderInline(item, `o${index}-${itemIndex}`)}</li>
              ))}
            </ol>
          ) : (
            <ul key={`b-${index}`} className={BULLET_LIST}>
              {block.items.map((item, itemIndex) => (
                <li key={`i-${itemIndex}`}>{renderInline(item, `u${index}-${itemIndex}`)}</li>
              ))}
            </ul>
          )
        ) : (
          <p
            key={`b-${index}`}
            className={[DEFAULT_PARAGRAPH, paragraphClassName].filter(Boolean).join(" ")}
          >
            {renderInline(block.text, `p${index}`)}
          </p>
        ),
      )}
    </div>
  );
}

function renderInline(text: string, prefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(INLINE_PATTERN.source, INLINE_PATTERN.flags);
  let cursor = 0;
  let match: RegExpExecArray | null;

  const key = () => `${prefix}-${nodes.length}`;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    if (match[1]) {
      nodes.push(
        <code key={key()} className={INLINE_CODE}>
          {match[1].slice(1, -1)}
        </code>,
      );
    } else if (match[2]) {
      nodes.push(<strong key={key()}>{renderInline(match[2].slice(2, -2), `${prefix}-b${nodes.length}`)}</strong>);
    } else if (match[3]) {
      nodes.push(<em key={key()}>{renderInline(match[3].slice(1, -1), `${prefix}-i${nodes.length}`)}</em>);
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
