import { NextRequest, NextResponse } from 'next/server';
import { getAllQuizQuestionsForClient } from '@/lib/quiz-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TEST_MODE } from '../test';
import { db } from '@/lib/db';
import { quizResults } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { SimpleEncryption } from '@/lib/encryption-utils';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user using NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user has already taken the quiz
    const existingResult = await db.select()
      .from(quizResults)
      .where(eq(quizResults.userId, session.user.id))
      .limit(1);

    if (existingResult.length > 0) {
      return NextResponse.json({ 
        error: 'User has already taken the quiz', 
        alreadyTaken: true 
      }, { status: 400 });
    }

    // Fetch all quiz questions from the database for client use (already without correct answers)
    const allQuestions = await getAllQuizQuestionsForClient();

    const testMode = TEST_MODE; // Use the common test mode variable

    let questions = allQuestions;

    if (testMode) {
      // In test mode, randomly select 3 questions
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      questions = shuffled.slice(0, 3);
    }

    // Encrypt the questions before sending
    const encryptedQuestions = SimpleEncryption.encrypt(JSON.stringify({ questions, testMode }));
    
    return NextResponse.json({ data: encryptedQuestions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}