import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { quizResults } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import QuizGameClient from '@/components/quiz-game-client';

export default async function QuizPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Check if the user has already taken the quiz
  const existingResult = await db.select()
    .from(quizResults)
    .where(eq(quizResults.userId, session.user.id))
    .limit(1);

  if (existingResult.length > 0) {
    // User has already taken the quiz, redirect to results page
    redirect('/results');
  }

  return (
    <div className="min-h-screen bg-black">
      <QuizGameClient userId={session.user?.id as string} />
    </div>
  );
}