import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizResults, users, quizQuestions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TEST_MODE } from '../test';

interface AnswerSubmission {
  userId: string | number; // Accept both string and number to handle different client implementations
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

    // Verify that the userId in the request matches the authenticated user's ID
    if (session.user?.id !== userId.toString()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid user ID' }, { status: 401 });
    }

    // Use the authenticated user's ID from the session
    const userIdString = session.user.id;

    console.log('Authenticated userId:', userIdString);

    console.log('Submitting answers:', answers); // Debug log

    // Check if the user has already taken the quiz
    const existingResult = await db.select()
      .from(quizResults)
      .where(eq(quizResults.userId, userIdString))
      .limit(1);

    if (existingResult.length > 0) {
      return NextResponse.json({ 
        error: 'User has already taken the quiz' 
      }, { status: 400 });
    }

    const testMode = TEST_MODE; // Use the common test mode variable

    // Total number of questions in the quiz
    let totalQuestions = answers.length;

    // If in test mode, only process the first 3 questions (or however many were sent)
    let filteredAnswers = answers;
    if (testMode) {
      // In test mode, we only evaluate the questions that were sent
      // This means totalQuestions should be the number of questions sent
      totalQuestions = answers.length;
    }

    // Process all answers (including unanswered ones)
    let score = 0;
    const processedAnswers = [];

    for (const answer of filteredAnswers) {
      if (answer.selectedOption === -1) {
        // Unanswered question - mark as incorrect
        processedAnswers.push({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: false
        });
      } else {
        // Validate the answered question
        const question = await db.select({
          correctAnswerIndex: quizQuestions.correctAnswerIndex
        }).from(quizQuestions).where(eq(quizQuestions.id, answer.questionId)).limit(1);

        if (question.length > 0) {
          const isCorrect = answer.selectedOption === question[0].correctAnswerIndex;
          if (isCorrect) {
            score++;
          }

          processedAnswers.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            isCorrect
          });
        } else {
          // Question not found in database - mark as incorrect
          processedAnswers.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            isCorrect: false
          });
        }
      }
    }

    console.log('Processed answers:', processedAnswers); // Debug log
    console.log('Calculated score:', score); // Debug log
    console.log('Total questions:', totalQuestions); // Debug log
    console.log('Test mode:', testMode); // Debug log

    // Insert quiz result only (no individual answers stored)
    const [result] = await db.insert(quizResults).values({
      userId: userIdString,
      score,
      totalQuestions,
      date: new Date()
    }).returning();

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