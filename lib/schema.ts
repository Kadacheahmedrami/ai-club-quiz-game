import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Empty for OAuth users
  name: text('name').notNull(),
  avatar: text('avatar'), // For OAuth profile pictures
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Quiz results table
export const quizResults = pgTable('quiz_results', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  date: timestamp('date').defaultNow().notNull(),
});

// Quiz answers table (to store individual answers for analysis)
export const quizAnswers = pgTable('quiz_answers', {
  id: serial('id').primaryKey(),
  resultId: integer('result_id').references(() => quizResults.id).notNull(),
  questionId: integer('question_id').notNull(),
  selectedOption: integer('selected_option').notNull(),
  isCorrect: boolean('is_correct').notNull(),
});