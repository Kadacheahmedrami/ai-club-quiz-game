import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { quizResults, users } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Check if the requesting user is authorized to access this data
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.email !== 'a_kadache@estin.dz' && session.user?.email !== 'aizen.souls.king@gmail.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch top 3 users based on quiz scores
    const topUsers = await db
      .select({
        name: users.name,
        email: users.email,
        score: quizResults.score,
        totalQuestions: quizResults.totalQuestions,
        createdAt: quizResults.createdAt,
      })
      .from(quizResults)
      .innerJoin(users, eq(quizResults.userId, users.id))
      .orderBy(desc(quizResults.score), desc(quizResults.createdAt))
      .limit(3);

    // Format the results
    const winners = topUsers.map((user) => ({
      name: user.name || user.email?.split('@')[0] || 'Anonymous',
      subtitle: `Score: ${user.score}/${user.totalQuestions}`
    }));

    // Pad with dummy data if we have less than 3 winners
    while (winners.length < 3) {
      winners.push({
        name: 'TBD',
        subtitle: 'Position to be determined'
      });
    }

    return NextResponse.json(winners);
  } catch (error) {
    console.error('Error fetching leaderboard winners:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
