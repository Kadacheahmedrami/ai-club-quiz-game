import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Disable prefetch as it's not supported in Next.js
const queryClient = postgres(process.env.DATABASE_URL || '');
export const db = drizzle(queryClient, { schema });