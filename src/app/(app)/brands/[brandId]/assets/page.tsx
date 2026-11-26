import type { Metadata } from 'next';
import { Download, FileSpreadsheet, FileText, Film, Image as ImageIcon, Presentation } from 'lucide-react';
import { deleteAssetAction, reprocessAssetAction, setAssetTrustAction } from '@/app/actions/assets';
import { AssetUploader, AutoRefresh } from '@/components/brand/asset-uploader';
import { BrandHeader } from '@/components/brand/brand-header';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatBytes, formatDate, Notice } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { env } from '@/lib/env';
import { ASSET_KIND_LABELS } from '@/lib/labels';
import { loadOrNotFound } from '@/lib/page-helpers';
import { listAssets } from '@/lib/services/assets';
import { getBrand } from '@/lib/services/brands';
import { listProducts } from '@/lib/services/products';

export const metadata: Metadata = { title: 'Documents & media' };

function FileIcon({ extension }: { extension: string }) {
  const props = { size: 18, strokeWidth: 1.5, className: 'text-ink-muted' };
  if (['png', 'jpg', 'webp', 'gif'].includes(extension)) return <ImageIcon {...props} />;
  if (['mp4', 'mov', 'webm'].includes(extension)) return <Film {...props} />;
  if (extension === 'xlsx' || extension === 'csv') return <FileSpreadsheet {...props} />;
  if (extension === 'pptx') return <Presentation {...props} />;
  return <FileText {...props} />;
}

async function Assets({ params }: { params: Promise<{ brandId: string }> }) {
  const ctx = await requireContext();
  const { brandId } = await params;
  const brand = await loadOrNotFound(() => getBrand(ctx, brandId));
  const [assets, products] = await Promise.all([listAssets(ctx, { brandId: brand.id }), listProducts(ctx, { brandId: brand.id })]);
  const canUpload = can(ctx, 'asset.upload');
  const canApprove = can(ctx, 'asset.approve_source');
  const canDelete = can(ctx, 'asset.delete');
  const working = assets.some(({ asset }) => asset.processingStatus === 'pending' || asset.processingStatus === 'processing');

  return (
    <>
      <BrandHeader brand={brand} current="assets" />
      <AutoRefresh active={working} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card>
          <CardHeader
            index="01"
            title="Library"
            description="Documents are read automatically and become searchable. Until a Brand Manager approves a document as an authoritative source, everything taken from it is labelled unverified."
          />
          {assets.length === 0 ? (
            <EmptyState title="Nothing uploaded yet">Upload the brand book first — it is the single most useful document for the engine.</EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Reading status</th>
                    <th>Trust</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(({ asset, uploaderName }) => (
                    <tr key={asset.id}>
                      <td>
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5">
                            <FileIcon extension={asset.extension} />
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-ink">{asset.title}</p>
                            <p className="mt-0.5 text-[12.5px] text-ink-muted">
                              {ASSET_KIND_LABELS[asset.kind] ?? asset.kind} · <span className="num uppercase">{asset.extension}</span> · {formatBytes(asset.sizeBytes)}
                              {asset.imageWidth && asset.imageHeight ? (
                                <>
                                  {' · '}
                                  <span className="num">
                                    {asset.imageWidth}×{asset.imageHeight}px
                                  </span>
                                </>
                              ) : null}
                            </p>
                            <p className="label mt-1 !text-[9.5px]">
                              {uploaderName ?? 'Former member'} · {formatDate(asset.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {asset.processingStatus === 'indexed' ? (
                          <>
                            <Badge tone="verified">Searchable</Badge>
                            <p className="mt-1 text-[12.5px] text-ink-muted">
                              <span className="num">{asset.chunkCount}</span> passages
                              {asset.pageCount ? (
                                <>
                                  {' from '}
                                  <span className="num">{asset.pageCount}</span> {asset.extension === 'pptx' ? 'slides' : asset.extension === 'xlsx' ? 'sheets' : 'pages'}
                                </>
                              ) : null}
                            </p>
                          </>
                        ) : asset.processingStatus === 'pending' || asset.processingStatus === 'processing' ? (
                          <Badge tone="calculated">Reading…</Badge>
                        ) : asset.processingStatus === 'failed' ? (
                          <>
                            <Badge tone="signal">Could not be read</Badge>
                            <p className="mt-1 max-w-[18rem] text-[12.5px] text-signal-deep">{asset.processingError}</p>
                          </>
                        ) : (
                          <>
                            <Badge tone="missing">Stored only</Badge>
                            <p className="mt-1 max-w-[18rem] text-[12.5px] text-ink-muted">{asset.processingError ?? 'Not a text document.'}</p>
                          </>
                        )}
                      </td>
                      <td>
                        {asset.processingStatus === 'indexed' ? (
                          asset.trustLevel === 'approved_source' ? (
                            <Badge tone="verified">Approved source</Badge>
                          ) : (
                            <Badge tone="estimated">Unverified</Badge>
                          )
                        ) : (
                          <span className="text-ink-muted">—</span>
                        )}
                      </td>
                      <td>
                        <div className="flex flex-wrap items-start justify-end gap-1">
                          <a
                            href={`/api/assets/${asset.id}/download`}
                            className="inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-[12.5px] font-medium text-ink-soft hover:bg-paper-deep hover:text-ink"
                          >
                            <Download size={13} /> Download
                          </a>
                          {canApprove && asset.processingStatus === 'indexed' ? (
                            asset.trustLevel === 'approved_source' ? (
                              <InlineAction action={setAssetTrustAction} fields={{ assetId: asset.id, trustLevel: 'unverified' }}>
                                Remove approval
                              </InlineAction>
                            ) : (
                              <InlineAction
                                action={setAssetTrustAction}
                                fields={{ assetId: asset.id, trustLevel: 'approved_source' }}
                                variant="secondary"
                                confirm={`Approve "${asset.title}" as an authoritative brand source? Its passages will be treated as approved brand knowledge.`}
                              >
                                Approve as source
                              </InlineAction>
                            )
                          ) : null}
                          {canUpload && asset.processingStatus === 'failed' ? (
                            <InlineAction action={reprocessAssetAction} fields={{ assetId: asset.id }}>
                              Try again
                            </InlineAction>
                          ) : null}
                          {canDelete ? (
                            <InlineAction action={deleteAssetAction} fields={{ assetId: asset.id }} confirm={`Delete "${asset.title}"? Its passages are removed from the knowledge base.`}>
                              Delete
                            </InlineAction>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          {canUpload ? (
            <Card>
              <CardHeader index="02" title="Upload" />
              <div className="p-5">
                <AssetUploader brandId={brand.id} products={products.map((p) => ({ id: p.id, name: p.name }))} maxMb={Math.round(env.maxUploadBytes / 1024 / 1024)} />
              </div>
            </Card>
          ) : null}
          <Notice title="Where your files go">
            Files are stored on your own server and read there. Nothing is sent to an outside AI service unless an Administrator switches that on in Settings.
          </Notice>
        </div>
      </div>
    </>
  );
}

export default function AssetsPage({ params }: { params: Promise<{ brandId: string }> }) {
  return (
    <PageBoundary>
      <Assets params={params} />
    </PageBoundary>
  );
}
