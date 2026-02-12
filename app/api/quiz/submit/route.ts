import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizResults, quizAnswers, users, quizQuestions } from '@/lib/schema';
import { eq, inArray } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateAnswers } from '@/lib/quiz-utils';

interface AnswerSubmission {
  userId: string; // Changed to string to match the users table ID type
  answers: {
    questionId: number;
    selectedOption: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user using NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AnswerSubmission = await request.json();
    const { userId, answers } = body;

    // Ensure the user ID in the session matches the one in the request
    if (session.user?.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid user ID' }, { status: 401 });
    }

    // Validate answers against the database
    const validatedAnswers = await validateAnswers(answers);

    // Calculate score based on validated answers
    let score = 0;
    const totalQuestions = validatedAnswers.length;

    validatedAnswers.forEach(answer => {
      if (answer.isCorrect) {
        score++;
      }
    });

    // Insert quiz result
    const [result] = await db.insert(quizResults).values({
      userId,
      score,
      totalQuestions,
      date: new Date()
    }).returning();

    // Insert individual answers
    const answersToInsert = validatedAnswers.map(answer => ({
      resultId: result.id,
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
      isCorrect: answer.isCorrect
    }));

    await db.insert(quizAnswers).values(answersToInsert);

    return NextResponse.json({
      success: true,
      score,
      totalQuestions,
      message: 'Quiz results saved successfully'
    });
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    return NextResponse.json({ error: 'Failed to submit quiz answers' }, { status: 500 });
  }
}