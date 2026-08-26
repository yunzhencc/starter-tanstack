import type { Config } from 'drizzle-kit';
import process from 'node:process';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

export default {
  dialect: 'postgresql',
  schema: './src/lib/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;
