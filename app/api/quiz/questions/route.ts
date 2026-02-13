import { NextRequest, NextResponse } from 'next/server';
import { getAllQuizQuestionsForClient } from '@/lib/quiz-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TEST_MODE } from '../test';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user using NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    return NextResponse.json({ questions, testMode });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}