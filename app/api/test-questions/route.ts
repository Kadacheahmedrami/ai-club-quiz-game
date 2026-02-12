import { getAllQuizQuestionsForClient } from '@/lib/quiz-utils';

export async function GET() {
  try {
    const questions = await getAllQuizQuestionsForClient();
    return Response.json({ questions, count: questions.length });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return Response.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}