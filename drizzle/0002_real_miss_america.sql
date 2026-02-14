DROP INDEX IF EXISTS "quiz_questions_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "quiz_results_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "quiz_results_date_idx";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP COLUMN IF EXISTS "expires";