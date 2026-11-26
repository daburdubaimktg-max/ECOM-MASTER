'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Upload } from 'lucide-react';
import { ASSET_KIND_LABELS } from '@/lib/labels';

type Result = { name: string; ok: boolean; message: string };

export function AssetUploader({ brandId, products, maxMb }: { brandId: string; products: { id: string; name: string }[]; maxMb: number }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [kind, setKind] = useState('brand_book');
  const [productId, setProductId] = useState('');
  // False in the server-rendered HTML, true once the page is interactive — lets automated tests know
  // when files can be chosen.
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length || busy) return;
    setBusy(true);
    setResults([]);
    const out: Result[] = [];
    for (const file of list) {
      if (file.size > maxMb * 1024 * 1024) {
        out.push({ name: file.name, ok: false, message: `Larger than the ${maxMb} MB limit.` });
        setResults([...out]);
        continue;
      }
      const body = new FormData();
      body.set('brandId', brandId);
      body.set('kind', kind);
      if (productId) body.set('productId', productId);
      body.set('file', file);
      try {
        const response = await fetch('/api/assets/upload', { method: 'POST', body });
        const json = (await response.json().catch(() => ({}))) as { error?: string };
        out.push(response.ok ? { name: file.name, ok: true, message: 'Uploaded.' } : { name: file.name, ok: false, message: json.error ?? 'Upload failed.' });
      } catch {
        out.push({ name: file.name, ok: false, message: 'Network problem — the file was not uploaded.' });
      }
      setResults([...out]);
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
    router.refresh();
  }

  return (
    <div className="space-y-4" data-ready={ready}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="asset-kind" className="mb-1.5 block text-[13px] font-medium">
            What is it?
          </label>
          <select id="asset-kind" value={kind} onChange={(e) => setKind(e.target.value)} className="field-input">
            {Object.entries(ASSET_KIND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="asset-product" className="mb-1.5 block text-[13px] font-medium">
            About a specific product?
          </label>
          <select id="asset-product" value={productId} onChange={(e) => setProductId(e.target.value)} className="field-input">
            <option value="">No — the whole brand</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-6 py-9 text-center transition-colors ${
          dragging ? 'border-signal bg-signal-soft' : 'border-line-strong bg-paper/50 hover:border-ink'
        } ${busy ? 'pointer-events-none opacity-60' : ''}`}
      >
        <Upload size={20} strokeWidth={1.5} className="text-ink-muted" />
        <span className="text-[14px] font-medium text-ink">{busy ? 'Uploading…' : 'Drop files here, or click to choose'}</span>
        <span className="max-w-sm text-[12.5px] text-ink-muted">
          PDF, Word, PowerPoint, Excel, text, images and videos · up to {maxMb} MB each
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          data-testid="asset-file-input"
          accept=".pdf,.docx,.pptx,.xlsx,.txt,.md,.csv,.png,.jpg,.jpeg,.webp,.gif,.mp4,.mov,.webm"
          onChange={(e) => e.target.files && void upload(e.target.files)}
        />
      </label>
      {results.length ? (
        <ul className="space-y-1 text-[13px]" aria-live="polite">
          {results.map((r, i) => (
            <li key={`${r.name}-${i}`} className={`border-l-2 px-3 py-1.5 ${r.ok ? 'border-verified bg-verified-soft text-verified' : 'border-signal bg-signal-soft text-signal-deep'}`}>
              <span className="font-medium">{r.name}</span> — {r.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Re-loads the page data every few seconds while documents are still being read. */
export function AutoRefresh({ active, intervalMs = 2500 }: { active: boolean; intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(timer);
  }, [active, intervalMs, router]);
  return null;
}
