import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizResults } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params promise to access userId
    const awaitedParams = await params;
    
    // Authenticate user using NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify that the userId in the request matches the authenticated user's ID
    if (session.user?.id !== awaitedParams.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid user ID' }, { status: 401 });
    }

    // Check if the user has already taken the quiz
    try {
      const existingResult = await db.select()
        .from(quizResults)
        .where(eq(quizResults.userId, awaitedParams.userId))
        .limit(1);

      if (existingResult.length > 0) {
        return NextResponse.json({
          exists: true,
          score: existingResult[0].score,
          totalQuestions: existingResult[0].totalQuestions,
          date: existingResult[0].date
        });
      } else {
        return NextResponse.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking quiz result:', error);
      return NextResponse.json({ error: 'Failed to check quiz result' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error checking quiz result:', error);
    return NextResponse.json({ error: 'Failed to check quiz result' }, { status: 500 });
  }
}