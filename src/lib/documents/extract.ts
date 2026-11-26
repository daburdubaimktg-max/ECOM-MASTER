import { unzipSync, strFromU8 } from 'fflate';
import type { TextSegment } from './chunk';

/**
 * Reads uploaded files and extracts their text. Everything here treats the file as untrusted input:
 * the real type is detected from the file's first bytes, archives are size-limited before they are
 * unpacked (zip-bomb protection) and nothing from a file is ever executed.
 */

export type FileKind = 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'text' | 'image' | 'video';

export type DetectedFile = { kind: FileKind; mimeType: string; extension: string };

const TEXT_EXTENSIONS: Record<string, string> = { txt: 'text/plain', md: 'text/markdown', csv: 'text/csv' };

const BY_MIME: Record<string, { kind: FileKind; extension: string }> = {
  'application/pdf': { kind: 'pdf', extension: 'pdf' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { kind: 'docx', extension: 'docx' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { kind: 'pptx', extension: 'pptx' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { kind: 'xlsx', extension: 'xlsx' },
  'image/png': { kind: 'image', extension: 'png' },
  'image/jpeg': { kind: 'image', extension: 'jpg' },
  'image/webp': { kind: 'image', extension: 'webp' },
  'image/gif': { kind: 'image', extension: 'gif' },
  'video/mp4': { kind: 'video', extension: 'mp4' },
  'video/quicktime': { kind: 'video', extension: 'mov' },
  'video/webm': { kind: 'video', extension: 'webm' },
};

export const ACCEPTED_FILE_TYPES_LABEL = 'PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), text/CSV, images (PNG, JPG, WebP, GIF) and videos (MP4, MOV, WebM)';

export class UnsupportedFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedFileError';
  }
}

function looksLikeUtf8Text(bytes: Uint8Array): boolean {
  const sample = bytes.subarray(0, Math.min(bytes.length, 64 * 1024));
  for (const b of sample) if (b === 0) return false;
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(sample.subarray(0, sample.length - 4 > 0 ? sample.length - 4 : sample.length));
    return true;
  } catch {
    return false;
  }
}

/** Works out what a file really is from its content. Throws for anything outside the allow-list. */
export async function detectFile(bytes: Uint8Array, originalFilename: string): Promise<DetectedFile> {
  const claimedExt = (originalFilename.split('.').pop() || '').toLowerCase();
  const { fileTypeFromBuffer } = await import('file-type');
  const detected = await fileTypeFromBuffer(bytes);

  if (detected) {
    const known = BY_MIME[detected.mime];
    if (known) return { kind: known.kind, mimeType: detected.mime, extension: known.extension };
    if (['application/x-cfb', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint'].includes(detected.mime)) {
      throw new UnsupportedFileError('Older Office formats (.doc, .xls, .ppt) are not supported. Please save the file as .docx, .xlsx or .pptx and upload it again.');
    }
    throw new UnsupportedFileError(`This file type (${detected.mime}) is not supported. Supported: ${ACCEPTED_FILE_TYPES_LABEL}.`);
  }
  if (TEXT_EXTENSIONS[claimedExt] && looksLikeUtf8Text(bytes)) {
    return { kind: 'text', mimeType: TEXT_EXTENSIONS[claimedExt], extension: claimedExt };
  }
  if (claimedExt === 'svg') {
    throw new UnsupportedFileError('SVG images are not accepted because they can contain scripts. Please upload a PNG or JPG version.');
  }
  throw new UnsupportedFileError(`The file type could not be recognised. Supported: ${ACCEPTED_FILE_TYPES_LABEL}.`);
}

const MAX_ARCHIVE_ENTRY_BYTES = 60 * 1024 * 1024;
const MAX_ARCHIVE_TOTAL_BYTES = 250 * 1024 * 1024;
const MAX_TEXT_CHARS = 4_000_000;

function safeUnzip(bytes: Uint8Array, wanted: (name: string) => boolean): Record<string, Uint8Array> {
  let total = 0;
  return unzipSync(bytes, {
    filter(file) {
      if (!wanted(file.name)) return false;
      if (file.originalSize > MAX_ARCHIVE_ENTRY_BYTES) throw new UnsupportedFileError('The document contains an unusually large part and was not processed.');
      total += file.originalSize;
      if (total > MAX_ARCHIVE_TOTAL_BYTES) throw new UnsupportedFileError('The document is too large to process safely.');
      return true;
    },
  });
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&');
}

function numericSuffix(name: string): number {
  const m = name.match(/(\d+)\.xml$/);
  return m ? parseInt(m[1], 10) : 0;
}

function extractDocx(bytes: Uint8Array): TextSegment[] {
  const files = safeUnzip(bytes, (n) => n === 'word/document.xml' || /^word\/(footnotes|endnotes)\.xml$/.test(n));
  const main = files['word/document.xml'];
  if (!main) throw new UnsupportedFileError('This does not look like a valid Word document.');
  const xml = strFromU8(main);
  const paragraphs: string[] = [];
  for (const p of xml.split(/<\/w:p>/)) {
    const withBreaks = p.replace(/<w:tab\b[^>]*\/>/g, '\t').replace(/<w:(br|cr)\b[^>]*\/>/g, '\n');
    const parts = [...withBreaks.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>|(\t)|(\n)/g)].map((m) => (m[1] !== undefined ? decodeXmlEntities(m[1]) : (m[2] ?? m[3] ?? '')));
    const text = parts.join('').trim();
    if (text) paragraphs.push(text);
  }
  return [{ text: paragraphs.join('\n\n'), locator: null, pageNumber: null }];
}

function extractPptx(bytes: Uint8Array): { segments: TextSegment[]; pageCount: number } {
  const files = safeUnzip(bytes, (n) => /^ppt\/slides\/slide\d+\.xml$/.test(n) || /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(n));
  const slideNames = Object.keys(files).filter((n) => n.startsWith('ppt/slides/')).sort((a, b) => numericSuffix(a) - numericSuffix(b));
  if (!slideNames.length) throw new UnsupportedFileError('This does not look like a valid PowerPoint file.');
  const textOf = (xml: string) =>
    xml
      .split(/<\/a:p>/)
      .map((p) => [...p.matchAll(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>/g)].map((m) => decodeXmlEntities(m[1])).join(''))
      .map((t) => t.trim())
      .filter(Boolean)
      .join('\n');
  const segments: TextSegment[] = [];
  for (const name of slideNames) {
    const n = numericSuffix(name);
    let text = textOf(strFromU8(files[name]));
    const notes = files[`ppt/notesSlides/notesSlide${n}.xml`];
    if (notes) {
      const noteText = textOf(strFromU8(notes)).replace(/^\d+$/gm, '').trim();
      if (noteText) text += `\n\nSpeaker notes: ${noteText}`;
    }
    if (text.trim()) segments.push({ text, locator: `Slide ${n}`, pageNumber: n });
  }
  return { segments, pageCount: slideNames.length };
}

function extractXlsx(bytes: Uint8Array): { segments: TextSegment[]; pageCount: number } {
  const files = safeUnzip(bytes, (n) => n === 'xl/sharedStrings.xml' || n === 'xl/workbook.xml' || /^xl\/worksheets\/sheet\d+\.xml$/.test(n));
  const sheetFiles = Object.keys(files).filter((n) => n.startsWith('xl/worksheets/')).sort((a, b) => numericSuffix(a) - numericSuffix(b));
  if (!sheetFiles.length) throw new UnsupportedFileError('This does not look like a valid Excel workbook.');

  const shared: string[] = [];
  if (files['xl/sharedStrings.xml']) {
    for (const si of strFromU8(files['xl/sharedStrings.xml']).split(/<\/si>/)) {
      const parts = [...si.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => decodeXmlEntities(m[1]));
      if (si.includes('<si')) shared.push(parts.join(''));
    }
  }
  const sheetNames: string[] = files['xl/workbook.xml']
    ? [...strFromU8(files['xl/workbook.xml']).matchAll(/<sheet\b[^>]*\bname="([^"]*)"/g)].map((m) => decodeXmlEntities(m[1]))
    : [];

  const segments: TextSegment[] = [];
  sheetFiles.forEach((name, i) => {
    const xml = strFromU8(files[name]);
    const lines: string[] = [];
    for (const row of xml.split(/<\/row>/).slice(0, 5000)) {
      const cells: string[] = [];
      for (const c of row.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const attrs = c[1];
        const inner = c[2] ?? '';
        const type = attrs.match(/\bt="([^"]+)"/)?.[1];
        let value = '';
        if (type === 'inlineStr') {
          value = [...inner.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => decodeXmlEntities(m[1])).join('');
        } else {
          const v = inner.match(/<v>([\s\S]*?)<\/v>/)?.[1];
          if (v !== undefined) value = type === 's' ? (shared[parseInt(v, 10)] ?? '') : decodeXmlEntities(v);
        }
        if (value.trim()) cells.push(value.trim());
      }
      if (cells.length) lines.push(cells.join(' | '));
    }
    const sheetName = sheetNames[i] ?? `Sheet ${i + 1}`;
    if (lines.length) segments.push({ text: lines.join('\n'), locator: `Sheet: ${sheetName}`, pageNumber: i + 1 });
  });
  return { segments, pageCount: sheetFiles.length };
}

async function extractPdf(bytes: Uint8Array): Promise<{ segments: TextSegment[]; pageCount: number }> {
  const { extractText, getDocumentProxy } = await import('unpdf');
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(text) ? text : [text];
  const segments = pages
    .map((pageText, i) => ({ text: String(pageText ?? ''), locator: `p. ${i + 1}`, pageNumber: i + 1 }))
    .filter((s) => s.text.trim().length > 0);
  return { segments, pageCount: totalPages };
}

export type ExtractionResult = {
  segments: TextSegment[];
  pageCount: number | null;
  textChars: number;
  /** Plain-English note shown to the user when nothing could be extracted. */
  note: string | null;
};

export async function extractText(bytes: Uint8Array, kind: FileKind): Promise<ExtractionResult> {
  let segments: TextSegment[] = [];
  let pageCount: number | null = null;
  switch (kind) {
    case 'pdf': {
      const r = await extractPdf(bytes);
      segments = r.segments;
      pageCount = r.pageCount;
      break;
    }
    case 'docx':
      segments = extractDocx(bytes);
      break;
    case 'pptx': {
      const r = extractPptx(bytes);
      segments = r.segments;
      pageCount = r.pageCount;
      break;
    }
    case 'xlsx': {
      const r = extractXlsx(bytes);
      segments = r.segments;
      pageCount = r.pageCount;
      break;
    }
    case 'text':
      segments = [{ text: new TextDecoder('utf-8').decode(bytes), locator: null, pageNumber: null }];
      break;
    case 'image':
    case 'video':
      return { segments: [], pageCount: null, textChars: 0, note: 'Stored in the asset library. Text is not extracted from images or videos yet.' };
  }
  let textChars = 0;
  const limited: TextSegment[] = [];
  for (const segment of segments) {
    if (textChars >= MAX_TEXT_CHARS) break;
    const text = segment.text.slice(0, MAX_TEXT_CHARS - textChars);
    textChars += text.length;
    limited.push({ ...segment, text });
  }
  const note =
    textChars === 0
      ? kind === 'pdf'
        ? 'No selectable text was found. This PDF is probably scanned images; text recognition (OCR) is planned for a later stage.'
        : 'No text was found in this file.'
      : null;
  return { segments: limited, pageCount, textChars, note };
}
