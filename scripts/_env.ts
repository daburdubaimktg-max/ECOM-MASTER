/**
 * Loads the same settings files the app reads (.env.local, .env.production.local, .env…), so a
 * maintenance command run from the terminal sees the same database and folders as the app itself.
 * Import this first in every script.
 */
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
