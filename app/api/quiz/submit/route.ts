import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizResults, quizAnswers, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface AnswerSubmission {
  userId: number;
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
    // Convert session user ID to number for comparison
    if (Number(session.user?.id) !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid user ID' }, { status: 401 });
    }

    // Calculate score based on correct answers
    let score = 0;
    const totalQuestions = answers.length;

    // Define correct answers for validation
    const correctAnswers: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0
    };

    // Calculate score
    answers.forEach(answer => {
      if (answer.selectedOption === correctAnswers[answer.questionId]) {
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
    const answersToInsert = answers.map(answer => ({
      resultId: result.id,
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
      isCorrect: answer.selectedOption === correctAnswers[answer.questionId]
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