import type { ReactNode } from "react";

import { INLINE_PATTERN, parseMarkdown } from "@/lib/markdown";

type MarkdownProps = {
  text?: string | null;
  className?: string;
  paragraphClassName?: string;
};

const DEFAULT_CONTAINER = "space-y-4";
const DEFAULT_PARAGRAPH = "whitespace-pre-line";
const INLINE_CODE =
  "rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[0.9em] text-emerald-200 [overflow-wrap:anywhere]";
/** Mobile: baris panjang di-wrap (`pre-wrap`) supaya tidak keluar kartu/terpotong.
 *  ≥sm kembali `pre` + scroll horizontal, kode tetap rapi satu baris. */
const CODE_BLOCK =
  "max-w-full overflow-x-auto whitespace-pre-wrap [overflow-wrap:anywhere] rounded-2xl border border-zinc-700 bg-zinc-950/80 p-4 text-left font-mono text-sm leading-6 text-zinc-200 sm:whitespace-pre sm:[overflow-wrap:normal]";
/** Judul di dalam deskripsi: `#`–`######` render sebagai heading, bukan marker mentah. */
const HEADING_LEVEL_1 = "text-xl sm:text-2xl font-semibold tracking-tight text-zinc-50";
const HEADING_LEVEL_2 = "text-lg sm:text-xl font-semibold tracking-tight text-zinc-100";
/** Marker di luar (list-outside via pl) supaya rapi saat kontainer memakai text-justify. */
const BULLET_LIST = "list-disc space-y-1.5 pl-5 marker:text-emerald-400";
const ORDERED_LIST = "list-decimal space-y-1.5 pl-5 marker:text-emerald-400";
/** Tabel: wrap sel (overflow-wrap:anywhere) → muat di mobile tanpa keluar kartu. */
const TABLE_WRAPPER = "max-w-full overflow-x-auto";
const TABLE = "w-full table-fixed border-collapse text-left text-[.95rem]";
const TABLE_HEAD_CELL =
  "border-b border-white/20 px-3 pb-2 align-top font-semibold text-zinc-50 [overflow-wrap:anywhere]";
const TABLE_CELL =
  "border-b border-white/8 px-3 py-2.5 align-top text-zinc-300 [overflow-wrap:anywhere]";

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
        ) : block.type === "table" ? (
          <div key={`b-${index}`} className={TABLE_WRAPPER}>
            <table className={TABLE}>
              {block.head.length > 0 ? (
                <thead>
                  <tr>
                    {block.head.map((cell, cellIndex) => (
                      <th
                        key={`c-${cellIndex}`}
                        style={{ textAlign: block.align[cellIndex] ?? "left" }}
                        className={TABLE_HEAD_CELL}
                      >
                        {renderInline(cell, `th${index}-${cellIndex}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`r-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`c-${cellIndex}`}
                        style={{ textAlign: block.align[cellIndex] ?? "left" }}
                        className={TABLE_CELL}
                      >
                        {renderInline(cell, `td${index}-${rowIndex}-${cellIndex}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : block.type === "heading" ? (
          block.level >= 4 ? (
            <h4 key={`b-${index}`} className={HEADING_LEVEL_2}>
              {renderInline(block.text, `h${index}`)}
            </h4>
          ) : (
            <h3 key={`b-${index}`} className={HEADING_LEVEL_1}>
              {renderInline(block.text, `h${index}`)}
            </h3>
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
