import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizResults, users } from '@/lib/schema';
import { desc, avg, count, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user using NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all quiz results with user information
    const results = await db
      .select({
        id: quizResults.id,
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        score: quizResults.score,
        totalQuestions: quizResults.totalQuestions,
        date: quizResults.date
      })
      .from(quizResults)
      .innerJoin(users, eq(quizResults.userId, users.id))
      .orderBy(desc(quizResults.date));

    // Calculate overall statistics
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalQuizzesResult = await db.select({ count: count() }).from(quizResults);
    const averageScoreResult = await db.select({ avg: avg(quizResults.score) }).from(quizResults);

    const totalUsers = parseInt(totalUsersResult[0].count.toString());
    const totalQuizzesTaken = parseInt(totalQuizzesResult[0].count.toString());
    const averageScore = averageScoreResult[0].avg ? parseFloat(averageScoreResult[0].avg.toString()) : 0;

    return NextResponse.json({ 
      results,
      statistics: {
        totalUsers,
        totalQuizzesTaken,
        averageScore
      }
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz results' }, { status: 500 });
  }
}