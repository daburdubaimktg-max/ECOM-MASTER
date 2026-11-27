import path from 'node:path';
import { EMBEDDING_DIMENSIONS } from '@/db/schema';
import { env } from './env';

/**
 * Embeddings turn a passage of text into a list of numbers so that passages with similar MEANING can
 * be found even when they use different words ("flaky scalp" finds "dandruff").
 *
 * Default provider: a small multilingual model (English, Arabic and ~100 other languages) that runs
 * on this server. No brand content leaves the machine and no API key is needed.
 */
export interface EmbeddingProvider {
  readonly model: string;
  readonly dimensions: number;
  embedPassages(texts: string[]): Promise<number[][]>;
  embedQuery(text: string): Promise<number[]>;
}

export const LOCAL_EMBEDDING_MODEL = 'Xenova/multilingual-e5-small';

type Status = { available: boolean; provider: string; model: string | null; reason: string | null };

const globalRef = globalThis as unknown as {
  __bieEmbeddings?: { promise: Promise<EmbeddingProvider | null>; status: Status };
};

async function loadLocal(): Promise<EmbeddingProvider> {
  // Optional dependency: imported lazily so the app still runs (keyword search only) without it.
  const moduleName = '@huggingface/transformers';
  const transformers = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ moduleName)) as typeof import('@huggingface/transformers');
  transformers.env.cacheDir = path.join(env.dataDir, 'models');
  const extractor = await transformers.pipeline('feature-extraction', LOCAL_EMBEDDING_MODEL, { dtype: 'q8' });

  const run = async (texts: string[]): Promise<number[][]> => {
    const output = await extractor(texts, { pooling: 'mean', normalize: true });
    return output.tolist() as number[][];
  };
  return {
    model: LOCAL_EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    // The E5 model family expects these prefixes to tell documents and questions apart.
    async embedPassages(texts) {
      const out: number[][] = [];
      for (let i = 0; i < texts.length; i += 16) {
        out.push(...(await run(texts.slice(i, i + 16).map((t) => `passage: ${t.slice(0, 2000)}`))));
      }
      return out;
    },
    async embedQuery(text) {
      return (await run([`query: ${text.slice(0, 1000)}`]))[0];
    },
  };
}

export function getEmbeddingProvider(): Promise<EmbeddingProvider | null> {
  if (!globalRef.__bieEmbeddings) {
    const status: Status = { available: false, provider: env.embeddingsProvider, model: null, reason: 'Loading…' };
    const promise: Promise<EmbeddingProvider | null> =
      env.embeddingsProvider === 'none'
        ? Promise.resolve(null).then(() => {
            status.reason = 'Semantic search is switched off (EMBEDDINGS_PROVIDER=none).';
            return null;
          })
        : loadLocal().then(
            (provider) => {
              status.available = true;
              status.model = provider.model;
              status.reason = null;
              return provider;
            },
            (err: unknown) => {
              status.reason = `The local embedding model could not be loaded (${err instanceof Error ? err.message.split('\n')[0] : String(err)}). Keyword search still works.`;
              return null;
            },
          );
    globalRef.__bieEmbeddings = { promise, status };
  }
  return globalRef.__bieEmbeddings.promise;
}

/**
 * For interactive requests: use the model if it is ready within `ms`, otherwise carry on without it
 * (the model keeps loading in the background — the very first use downloads it, which can take a minute).
 */
export async function getEmbeddingProviderWithin(ms: number): Promise<{ provider: EmbeddingProvider | null; stillLoading: boolean }> {
  const loading = getEmbeddingProvider();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<'timeout'>((resolve) => {
    timer = setTimeout(() => resolve('timeout'), ms);
  });
  const result = await Promise.race([loading, timeout]);
  if (timer) clearTimeout(timer);
  if (result === 'timeout') return { provider: null, stillLoading: true };
  return { provider: result, stillLoading: false };
}

export async function embeddingStatus(): Promise<Status> {
  await getEmbeddingProvider();
  return { ...globalRef.__bieEmbeddings!.status };
}

export function toVectorLiteral(vector: number[]): string {
  return `[${vector.map((v) => (Number.isFinite(v) ? v.toFixed(6) : '0')).join(',')}]`;
}
