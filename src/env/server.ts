import process from 'node:process';
import { z } from 'zod';
import '@tanstack/react-start/server-only';

const schema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  VITE_BASE_URL: z.url().default('http://localhost:3000'),
});

export const env = schema.parse(process.env);
