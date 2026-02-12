import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database'; // Assuming we'll create this
import QuizResult from '@/models/QuizResult'; // Assuming we'll create this model
import User from '@/models/User'; // Assuming we'll create this model

interface AnswerSubmission {
  userId: string;
  answers: {
    questionId: number;
    selectedOption: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: AnswerSubmission = await request.json();
    const { userId, answers } = body;

    // Connect to database
    await connectToDatabase();

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

    // Create new quiz result
    const quizResult = new QuizResult({
      user: userId,
      answers,
      score,
      totalQuestions,
      date: new Date()
    });

    await quizResult.save();

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