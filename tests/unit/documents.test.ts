import { describe, expect, it } from 'vitest';
import { chunkSegments, detectLang } from '@/lib/documents/chunk';
import { detectFile, extractText, UnsupportedFileError } from '@/lib/documents/extract';
import { fixture } from '../helpers';

describe('file type detection (from content, not from the file name)', () => {
  it('recognises each supported document type', async () => {
    expect((await detectFile(fixture('demo-brand-book.pdf'), 'x.pdf')).kind).toBe('pdf');
    expect((await detectFile(fixture('demo-product-catalogue.docx'), 'x.docx')).kind).toBe('docx');
    expect((await detectFile(fixture('demo-range-presentation.pptx'), 'x.pptx')).kind).toBe('pptx');
    expect((await detectFile(fixture('demo-claims-register.xlsx'), 'x.xlsx')).kind).toBe('xlsx');
    expect((await detectFile(fixture('demo-hero-image.png'), 'x.png')).kind).toBe('image');
    expect((await detectFile(fixture('demo-products.csv'), 'products.csv')).kind).toBe('text');
  });

  it('is not fooled by a misleading extension', async () => {
    const detected = await detectFile(fixture('demo-brand-book.pdf'), 'holiday-photo.png');
    expect(detected).toMatchObject({ kind: 'pdf', extension: 'pdf', mimeType: 'application/pdf' });
  });

  it('rejects executables, scripts disguised as text, SVG and unknown binary data', async () => {
    const exe = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00]);
    await expect(detectFile(exe, 'brand-book.pdf')).rejects.toBeInstanceOf(UnsupportedFileError);
    await expect(detectFile(new TextEncoder().encode('<svg onload="alert(1)"></svg>'), 'logo.svg')).rejects.toBeInstanceOf(UnsupportedFileError);
    await expect(detectFile(new Uint8Array([0, 1, 2, 3, 0, 255, 254, 0, 9, 9]), 'notes.txt')).rejects.toBeInstanceOf(UnsupportedFileError);
    await expect(detectFile(new TextEncoder().encode('#!/bin/sh\nrm -rf /'), 'run.sh')).rejects.toBeInstanceOf(UnsupportedFileError);
  });
});

describe('text extraction', () => {
  it('reads a PDF page by page', async () => {
    const result = await extractText(fixture('demo-brand-book.pdf'), 'pdf');
    expect(result.pageCount).toBe(4);
    expect(result.segments).toHaveLength(4);
    expect(result.segments[1]).toMatchObject({ locator: 'p. 2', pageNumber: 2 });
    expect(result.segments[1].text).toContain('knowledgeable friend');
    expect(result.segments[3].text).toContain('cures dandruff');
  });

  it('reads a Word document including Arabic text', async () => {
    const result = await extractText(fixture('demo-product-catalogue.docx'), 'docx');
    const text = result.segments.map((s) => s.text).join('\n');
    expect(text).toContain('Nourishing Hair Oil');
    expect(text).toContain('flaky scalp');
    expect(text).toContain('زيت شعر مغذي');
  });

  it('reads PowerPoint slides with their speaker notes and slide numbers', async () => {
    const result = await extractText(fixture('demo-range-presentation.pptx'), 'pptx');
    expect(result.pageCount).toBe(3);
    expect(result.segments[1].locator).toBe('Slide 2');
    expect(result.segments[1].text).toContain('Strengthening Shampoo');
    expect(result.segments[1].text).toContain('hero product is Nourishing Hair Oil');
  });

  it('reads Excel sheets row by row with sheet names', async () => {
    const result = await extractText(fixture('demo-claims-register.xlsx'), 'xlsx');
    expect(result.segments.map((s) => s.locator)).toEqual(['Sheet: Claims register', 'Sheet: Pack sizes']);
    expect(result.segments[0].text).toContain('Clinically proven to regrow hair | Restricted');
    expect(result.segments[1].text).toContain('DB-HO-ALM-200 | 200 | 24');
  });

  it('stores images without pretending to have read text from them', async () => {
    const result = await extractText(fixture('demo-hero-image.png'), 'image');
    expect(result.segments).toEqual([]);
    expect(result.note).toMatch(/not extracted/i);
  });
});

describe('chunking', () => {
  it('never mixes pages in one passage and keeps the page reference', () => {
    const chunks = chunkSegments([
      { text: 'First page text about brand tone of voice and personality.', locator: 'p. 1', pageNumber: 1 },
      { text: 'Second page text about visual identity and logo usage.', locator: 'p. 2', pageNumber: 2 },
    ]);
    expect(chunks).toHaveLength(2);
    expect(chunks.map((c) => c.pageNumber)).toEqual([1, 2]);
  });

  it('splits long text into passages of bounded size that together cover everything', () => {
    const sentence = 'The nourishing hair oil soothes a dry scalp and leaves hair soft. ';
    const text = Array.from({ length: 120 }, (_, i) => `${sentence}Paragraph ${i}.`).join('\n\n');
    const chunks = chunkSegments([{ text, locator: null, pageNumber: null }]);
    expect(chunks.length).toBeGreaterThan(5);
    for (const chunk of chunks) expect(chunk.content.length).toBeLessThanOrEqual(1400);
    for (let i = 0; i < 120; i++) expect(chunks.some((c) => c.content.includes(`Paragraph ${i}.`))).toBe(true);
  });

  it('detects Arabic passages so they are searched with Arabic language rules', () => {
    expect(detectLang('زيت شعر مغذي باللوز وجوز الهند')).toBe('arabic');
    expect(detectLang('Nourishing hair oil with almond')).toBe('english');
    expect(detectLang('Demo Botanics زيت')).toBe('english');
  });

  it('drops empty input', () => {
    expect(chunkSegments([{ text: '   \n\n  ', locator: null, pageNumber: null }])).toEqual([]);
  });
});
