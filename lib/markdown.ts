/**
 * Parser markdown ringan untuk konten admin (deskripsi project, bio profil).
 * Dipakai untuk output React aman (tanpa dangerouslySetInnerHTML) dan untuk
 * metadata (stripMarkdown → teks polos).
 *
 * Dukungan:
 * - **tebal** / *miring*
 * - `code inline` dan blok ```code block``` (termasuk bash/shell)
 * - daftar bullet (`- item` / `* item`) dan bernomor (`1. item`)
 * - baris kosong = paragraf baru, satu newline = <br>
 */

export type MarkdownBlock =
  | { type: "code"; lang: string; code: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "paragraph"; text: string };

/** Inline: code span, bold, italic. Urutan penting supaya ** tidak terbaca italic. */
export const INLINE_PATTERN = /(`[^`\n]+`)|(\*\*[^*]+?\*\*)|(\*[^*\n]+?\*)/g;

/** Pecah teks menjadi blok code dan paragraf. */
export function parseMarkdown(source?: string | null): MarkdownBlock[] {
  const text = (source ?? "").replace(/\r\n?/g, "\n");
  if (!text.trim()) return [];

  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < text.length) {
    if (text.startsWith("```", i)) {
      const lineEnd = text.indexOf("\n", i);
      const lang = (lineEnd === -1 ? "" : text.slice(i + 3, lineEnd)).trim();
      const bodyStart = lineEnd === -1 ? text.length : lineEnd + 1;
      const close = text.indexOf("```", bodyStart);
      const bodyEnd = close === -1 ? text.length : close;
      blocks.push({
        type: "code",
        lang,
        code: text.slice(bodyStart, bodyEnd).replace(/\s+$/, ""),
      });
      i = close === -1 ? text.length : close + 3;
      continue;
    }

    const next = text.indexOf("```", i);
    const segment = (next === -1 ? text.slice(i) : text.slice(i, next)).replace(/^\n+|\n+$/g, "");
    pushTextBlocks(blocks, segment);
    i = next === -1 ? text.length : next;
  }

  return blocks;
}

const LIST_MARKER = /^\s*(?:([-*+])|(\d+)\.)\s+/;

/** Pecah segmen teks menjadi paragraf dan daftar (bullet/bernominasi). */
function pushTextBlocks(blocks: MarkdownBlock[], segment: string) {
  const paragraphs: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    const value = paragraphs.join("\n").replace(/^\n+|\s+$/g, "");
    if (value) blocks.push({ type: "paragraph", text: value });
    paragraphs.length = 0;
  };
  const flushList = () => {
    if (list) blocks.push({ type: "list", ordered: list.ordered, items: [...list.items] });
    list = null;
  };

  for (const line of segment.split("\n")) {
    const marker = line.match(LIST_MARKER);

    if (marker) {
      flushParagraph();
      const ordered = marker[2] !== undefined;
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(line.slice(marker[0].length));
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    flushList();
    paragraphs.push(line);
  }

  flushParagraph();
  flushList();
}

/** Teks polos untuk metadata/JSON-LD: hilangkan marker markdown. */
export function stripMarkdown(source?: string | null): string {
  if (!source) return "";
  return source
    .replace(/\r\n?/g, "\n")
    .replace(/```[^\n]*\n?([\s\S]*?)```/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
