/**
 * Tiny dependency-free PDF writer used for generated project data sheets.
 * Produces a single- or multi-page A4 document with Helvetica text.
 */

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 56;
const LINES_PER_PAGE = 46;

export interface PdfBlock {
  text: string;
  style?: "title" | "heading" | "label" | "body";
}

function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, maxChars: number): string[] {
  const out: string[] = [];
  for (const paragraph of text.split(/\n/)) {
    if (!paragraph.trim()) {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      if ((line + " " + word).trim().length > maxChars) {
        out.push(line.trim());
        line = word;
      } else {
        line = `${line} ${word}`;
      }
    }
    if (line.trim()) out.push(line.trim());
  }
  return out;
}

interface Line {
  text: string;
  size: number;
  bold: boolean;
  gap: number;
}

function layout(blocks: PdfBlock[]): Line[] {
  const lines: Line[] = [];
  for (const block of blocks) {
    const style = block.style ?? "body";
    const size = style === "title" ? 20 : style === "heading" ? 13 : style === "label" ? 9 : 10.5;
    const bold = style === "title" || style === "heading" || style === "label";
    const maxChars = style === "title" ? 42 : style === "heading" ? 66 : 88;
    for (const text of wrap(block.text, maxChars)) {
      lines.push({ text, size, bold, gap: size * 1.55 });
    }
    lines.push({ text: "", size, bold: false, gap: style === "title" ? 14 : 8 });
  }
  return lines;
}

/** Renders the blocks into PDF bytes. */
export function renderPdf(blocks: PdfBlock[]): Uint8Array {
  const lines = layout(blocks);
  const pages: Line[][] = [];
  for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
    pages.push(lines.slice(i, i + LINES_PER_PAGE));
  }
  if (pages.length === 0) pages.push([]);

  const contents = pages.map((pageLines) => {
    let y = PAGE_HEIGHT - MARGIN;
    let stream = "";
    for (const line of pageLines) {
      if (line.text) {
        stream += `BT /${line.bold ? "F2" : "F1"} ${line.size} Tf 1 0 0 1 ${MARGIN} ${y.toFixed(1)} Tm (${escapeText(line.text)}) Tj ET\n`;
      }
      y -= line.gap;
    }
    return stream;
  });

  const objects: string[] = [];
  const pageCount = pages.length;
  const kids = Array.from({ length: pageCount }, (_, i) => `${4 + i * 2} 0 R`).join(" ");

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(`<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`);
  objects.push(
    "<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>",
  );

  contents.forEach((stream, index) => {
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources 3 0 R /Contents ${5 + index * 2} 0 R >>`,
    );
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return bytes;
}
