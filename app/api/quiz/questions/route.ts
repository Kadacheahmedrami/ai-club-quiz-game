import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TEST_MODE } from '../test';
import { isUserRateLimited } from '@/lib/rate-limiter';
import { db } from '@/lib/db';
import { quizResults } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { SecureEncryption } from '@/lib/encryption-utils';
import { readQuestionsFromCSV, getRandomQuestions } from '@/lib/csv-utils';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user using NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add rate limiting check
    if (isUserRateLimited(session.user.id)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
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

    // Read questions from CSV file
    const csvFilePath = path.join(process.cwd(), 'app/api/quiz/questions/questions.csv');
    let allQuestions = readQuestionsFromCSV(csvFilePath);

    // Transform the CSV data to match the expected Question interface
    const questionsForClient = allQuestions.map(({ id, question, option_a, option_b, option_c, option_d }) => ({
      id: parseInt(id),
      question,
      options: [option_a, option_b, option_c, option_d]
      // Note: correct_answer_index is intentionally excluded to prevent cheating
    }));

    const testMode = TEST_MODE; // Use the common test mode variable

    let questions;

    if (testMode) {
      // In test mode, randomly select 3 questions
      const shuffled = [...questionsForClient].sort(() => 0.5 - Math.random());
      questions = shuffled.slice(0, 3);
    } else {
      // Randomly select 40 questions from the full set
      questions = getRandomQuestions(questionsForClient, 40);
    }

    // Encrypt the questions before sending
    const encryptedQuestions = SecureEncryption.encrypt(JSON.stringify({ questions, testMode }));

    return NextResponse.json({ data: encryptedQuestions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}
