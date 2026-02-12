CREATE TABLE "quiz_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"option1" text NOT NULL,
	"option2" text NOT NULL,
	"option3" text NOT NULL,
	"option4" text NOT NULL,
	"correct_answer_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;