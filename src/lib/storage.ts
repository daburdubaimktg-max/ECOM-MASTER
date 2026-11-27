import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { env } from './env';

/**
 * File storage for uploaded assets. The first build stores files on the server's disk under
 * <data dir>/uploads. The interface is deliberately tiny so an S3-compatible driver (Supabase
 * Storage, Cloudflare R2, AWS S3) can replace it for production without touching the rest of the app.
 */
export interface StorageDriver {
  put(key: string, bytes: Uint8Array): Promise<void>;
  read(key: string): Promise<Buffer>;
  stream(key: string): fs.ReadStream;
  size(key: string): Promise<number>;
  remove(key: string): Promise<void>;
}

const KEY_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;

function resolveKey(root: string, key: string): string {
  if (!KEY_PATTERN.test(key) || key.includes('..')) throw new Error('Invalid storage key.');
  const full = path.resolve(root, key);
  if (!full.startsWith(path.resolve(root) + path.sep)) throw new Error('Invalid storage key.');
  return full;
}

class LocalDiskStorage implements StorageDriver {
  constructor(private root: string) {}
  async put(key: string, bytes: Uint8Array): Promise<void> {
    const file = resolveKey(this.root, key);
    await fsp.mkdir(path.dirname(file), { recursive: true });
    await fsp.writeFile(file, bytes, { mode: 0o600 });
  }
  read(key: string): Promise<Buffer> {
    return fsp.readFile(resolveKey(this.root, key));
  }
  stream(key: string): fs.ReadStream {
    return fs.createReadStream(resolveKey(this.root, key));
  }
  async size(key: string): Promise<number> {
    return (await fsp.stat(resolveKey(this.root, key))).size;
  }
  async remove(key: string): Promise<void> {
    await fsp.rm(resolveKey(this.root, key), { force: true });
  }
}

let driver: StorageDriver | null = null;

export function getStorage(): StorageDriver {
  driver ??= new LocalDiskStorage(path.join(env.dataDir, 'uploads'));
  return driver;
}

/** Tests can swap in a temporary folder. */
export function setStorageRootForTests(root: string): void {
  driver = new LocalDiskStorage(root);
}
