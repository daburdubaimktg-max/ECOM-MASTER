import { createHash } from 'node:crypto';

/** A piece of extracted text together with where it came from in the source document. */
export type TextSegment = { text: string; locator?: string | null; pageNumber?: number | null };

export type Chunk = {
  index: number;
  content: string;
  locator: string | null;
  pageNumber: number | null;
  lang: 'english' | 'arabic';
  contentHash: string;
};

const TARGET_CHARS = 900;
const MAX_CHARS = 1200;
const OVERLAP_CHARS = 150;
const MIN_CHARS = 24;

export function normaliseWhitespace(text: string): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Arabic-script share of the letters in a text, used to pick the right search language. */
export function detectLang(text: string): 'english' | 'arabic' {
  let arabic = 0;
  let letters = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if ((code >= 0x0600 && code <= 0x06ff) || (code >= 0x0750 && code <= 0x077f) || (code >= 0xfb50 && code <= 0xfdff) || (code >= 0xfe70 && code <= 0xfeff)) {
      arabic++;
      letters++;
    } else if (/\p{L}/u.test(ch)) {
      letters++;
    }
  }
  return letters > 0 && arabic / letters > 0.3 ? 'arabic' : 'english';
}

function splitLong(paragraph: string): string[] {
  if (paragraph.length <= MAX_CHARS) return [paragraph];
  const sentences = paragraph.split(/(?<=[.!?؟。])\s+/);
  const out: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (sentence.length > MAX_CHARS) {
      if (current) {
        out.push(current);
        current = '';
      }
      for (let i = 0; i < sentence.length; i += TARGET_CHARS) out.push(sentence.slice(i, i + TARGET_CHARS));
      continue;
    }
    if (current && current.length + sentence.length + 1 > TARGET_CHARS) {
      out.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) out.push(current);
  return out;
}

/**
 * Splits extracted text into search passages of roughly 900 characters. Passages never cross a page /
 * slide / sheet boundary (so a citation always points at one place) and neighbouring passages overlap
 * slightly so a sentence cut at a boundary is still findable.
 */
export function chunkSegments(segments: TextSegment[]): Chunk[] {
  const chunks: Chunk[] = [];
  for (const segment of segments) {
    const text = normaliseWhitespace(segment.text ?? '');
    if (!text) continue;
    const paragraphs = text.split(/\n{2,}|\n(?=[•\-–*] )/).flatMap((p) => splitLong(p.trim())).filter(Boolean);

    let current = '';
    const flush = () => {
      const content = current.trim();
      if (content.length >= MIN_CHARS || (content.length > 0 && paragraphs.length === 1)) {
        chunks.push({
          index: chunks.length,
          content,
          locator: segment.locator ?? null,
          pageNumber: segment.pageNumber ?? null,
          lang: detectLang(content),
          contentHash: createHash('sha256').update(content).digest('hex'),
        });
      }
    };
    for (const paragraph of paragraphs) {
      if (current && current.length + paragraph.length + 2 > TARGET_CHARS) {
        flush();
        const tail = current.slice(-OVERLAP_CHARS);
        const cut = tail.indexOf(' ');
        current = (cut >= 0 ? tail.slice(cut + 1) : '') + '\n' + paragraph;
      } else {
        current = current ? `${current}\n${paragraph}` : paragraph;
      }
    }
    flush();
  }
  return chunks;
}
