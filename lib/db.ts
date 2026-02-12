import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { 
  users, 
  accounts, 
  sessions, 
  verificationTokens, 
  quizResults, 
  quizAnswers 
} from './schema';

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Define the schema object with all tables
export const schema = {
  users,
  accounts,
  sessions,
  verificationTokens,
  quizResults,
  quizAnswers,
} as const;

// Create Neon HTTP client (optimized for Vercel serverless)
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export types for use in your app
export type Database = typeof db;