import { NextRequest, NextResponse } from 'next/server';
import { getAllQuizQuestionsForClient } from '@/lib/quiz-utils';

export async function GET(request: NextRequest) {
  try {
    // Fetch all quiz questions from the database for client use (already without correct answers)
    const questions = await getAllQuizQuestionsForClient();
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}