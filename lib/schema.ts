import { pgTable, serial, text, integer, timestamp, boolean, primaryKey, index } from 'drizzle-orm/pg-core';
import { type AdapterAccount } from '@auth/core/adapters';

// ============================================
// NextAuth.js / Auth.js Tables (DO NOT MODIFY)
// ============================================

export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ============================================
// Application Tables
// ============================================

export const quizResults = pgTable('quiz_results', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  date: timestamp('date').defaultNow().notNull(),
});

export const quizAnswers = pgTable('quiz_answers', {
  id: serial('id').primaryKey(),
  resultId: integer('result_id')
    .notNull()
    .references(() => quizResults.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull(),
  selectedOption: integer('selected_option').notNull(),
  isCorrect: boolean('is_correct').notNull(),
});

// ============================================
// TypeScript Types
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type QuizResult = typeof quizResults.$inferSelect;
export type NewQuizResult = typeof quizResults.$inferInsert;

export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type NewQuizAnswer = typeof quizAnswers.$inferInsert;