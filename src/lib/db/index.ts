import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '#/env/server';
import '@tanstack/react-start/server-only';

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client);
