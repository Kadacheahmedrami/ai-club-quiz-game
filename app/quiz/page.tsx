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
  try {
    const results = await db.select({ id: quizResults.id }) // Only select the id to minimize data transfer
      .from(quizResults)
      .where(eq(quizResults.userId, session.user?.id as string))
      .limit(1);

    if (results.length > 0) {
      // User has already taken the quiz, redirect to results page
      redirect('/results');
    }
  } catch (error) {
    console.error('Error checking quiz status:', error);
  }

  return (
    <div className="min-h-screen bg-black">
      <QuizGameClient userId={session.user?.id as string} />
    </div>
  );
}