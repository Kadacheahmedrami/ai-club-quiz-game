CREATE INDEX IF NOT EXISTS "quiz_questions_id_idx" ON "quiz_questions" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quiz_results_user_id_idx" ON "quiz_results" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quiz_results_date_idx" ON "quiz_results" USING btree ("date");