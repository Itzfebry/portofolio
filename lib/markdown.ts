/**
 * Parser markdown ringan untuk konten admin (deskripsi project, bio profil).
 * Dipakai untuk output React aman (tanpa dangerouslySetInnerHTML) dan untuk
 * metadata (stripMarkdown → teks polos).
 *
 * Dukungan:
 * - **tebal** / *miring*
 * - `code inline` dan blok ```code block``` (termasuk bash/shell)
 * - judul `# s/d ######` (tanpa marker mentah di output)
 * - daftar bullet (`- item` / `* item`) dan bernomor (`1. item`)
 * - tabel (`| Kolom | Kolom |` + baris pemisah `| --- |`), termasuk rata kolom `:-:`
 * - baris kosong = paragraf baru, satu newline = <br>
 */

export type MarkdownAlign = "left" | "center" | "right";

export type MarkdownBlock =
  | { type: "code"; lang: string; code: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | {
      type: "table";
      head: string[];
      align: MarkdownAlign[];
      rows: string[][];
    }
  | { type: "heading"; level: number; text: string }
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
/** Judul markdown: `## Judul` → blok heading, bukan teks mentah. */
const HEADING_MARKER = /^(#{1,6})\s+(.*)$/;
/** Baris tabel: diawali dan diakhiri `|`, contoh `| Kolom | Nilai |`. */
const TABLE_ROW = /^\s*\|(.*)\|\s*$/;
/** Baris pemisah tabel: `| --- |`, `| :-: |`, `| -- |`. */
const TABLE_SEPARATOR_CELL = /^:?-+:?$/;

/** Pecah baris `| a | b |` menjadi sel ["a", "b"]; null jika bukan baris tabel. */
function splitTableRow(line: string): string[] | null {
  const match = line.match(TABLE_ROW);
  if (!match) return null;
  const cells = match[1].split("|").map((cell) => cell.trim());
  // `||` atau baris pipe kosong murni bukan tabel.
  if (!cells.some((cell) => cell.length > 0)) return null;
  return cells;
}

function parseAlign(cell: string): MarkdownAlign {
  if (cell.startsWith(":") && cell.endsWith(":")) return "center";
  if (cell.endsWith(":")) return "right";
  return "left";
}

/** Pecah segmen teks menjadi paragraf, daftar, dan tabel. */
function pushTextBlocks(blocks: MarkdownBlock[], segment: string) {
  const paragraphs: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let tableRows: string[][] | null = null;

  const flushParagraph = () => {
    const value = paragraphs.join("\n").replace(/^\n+|\s+$/g, "");
    if (value) blocks.push({ type: "paragraph", text: value });
    paragraphs.length = 0;
  };
  const flushList = () => {
    if (list) blocks.push({ type: "list", ordered: list.ordered, items: [...list.items] });
    list = null;
  };
  const flushTable = () => {
    if (!tableRows) return;
    const rows = tableRows;
    tableRows = null;
    if (rows.length === 0) return;

    const isSeparator = (cells: string[]) =>
      cells.length > 0 && cells.every((cell) => TABLE_SEPARATOR_CELL.test(cell));

    let head: string[] = [];
    let body = rows;
    let align: MarkdownAlign[] = [];

    if (rows.length > 1 && isSeparator(rows[1])) {
      head = rows[0];
      align = rows[1].map(parseAlign);
      body = rows.slice(2);
    } else if (rows.length > 0) {
      align = rows[0].map(() => "left" as MarkdownAlign);
    }

    // Samakan jumlah kolom: baris yang kurang sel di-pad "".
    const columnCount = Math.max(...rows.map((row) => row.length), head.length, align.length);
    const pad = (row: string[]) => [...row, ...Array<string>(columnCount - row.length).fill("")];
    const padAlign = (list_: MarkdownAlign[]) => [
      ...list_,
      ...Array<MarkdownAlign>(columnCount - list_.length).fill("left"),
    ];

    blocks.push({
      type: "table",
      head: head.length > 0 ? pad(head) : [],
      align: padAlign(align),
      rows: body.map(pad),
    });
  };

  for (const line of segment.split("\n")) {
    const row = splitTableRow(line);

    if (row) {
      flushParagraph();
      flushList();
      if (!tableRows) tableRows = [];
      tableRows.push(row);
      continue;
    }

    // Baris non-tabel menutup tabel yang sedang berjalan.
    flushTable();

    const heading = line.match(HEADING_MARKER);

    if (heading) {
      flushParagraph();
      flushList();
      const text = heading[2].trim();
      if (text) blocks.push({ type: "heading", level: heading[1].length, text });
      continue;
    }

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
  flushTable();
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
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
