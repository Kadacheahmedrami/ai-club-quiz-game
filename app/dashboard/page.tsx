import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { quizResults, users } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import LeaderboardClient from './leaderboard-client';

export default async function DashboardPage() {
  // Server-side authentication check
  const session = await getServerSession(authOptions);

  // Redirect unauthenticated users to login
  if (!session) {
    redirect('/login');
  }

  // Server-side authorization check - only allow specific users
  const allowedEmails = ['a_kadache@estin.dz'];
  
  if (!session.user?.email || !allowedEmails.includes(session.user.email)) {
    redirect('/');
  }

  // Fetch winners data from the database on the server
  let winnersData = [
    { name: 'Loading...', subtitle: 'Loading...' },
    { name: 'Loading...', subtitle: 'Loading...' },
    { name: 'Loading...', subtitle: 'Loading...' }
  ];

  try {
    // Fetch top 3 users by quiz performance
    const results = await db
      .select({
        userId: quizResults.userId,
        name: users.name,
        email: users.email,
        score: quizResults.score,
        totalQuestions: quizResults.totalQuestions,
      })
      .from(quizResults)
      .innerJoin(users, eq(quizResults.userId, users.id))
      .orderBy(desc(quizResults.score), desc(quizResults.date))
      .limit(3);

    if (results.length > 0) {
      winnersData = results.map((result, index) => ({
        name: result.name || `Player ${index + 1}`,
        subtitle: `Score: ${result.score}/${result.totalQuestions}`
      }));

      // Ensure we always have 3 entries
      while (winnersData.length < 3) {
        winnersData.push({
          name: 'No Data',
          subtitle: 'No quizzes completed'
        });
      }
    }
  } catch (error) {
    console.error('Error fetching winners:', error);
    // Fallback data
    winnersData = [
      { name: 'Ahmed Benali', subtitle: 'Top Performer 2026' },
      { name: 'Sara K.', subtitle: 'Top Performer 2026' },
      { name: 'Yacine M.', subtitle: 'Top Performer 2026' }
    ];
  }

  // Pass the winners data to the client component
  return <LeaderboardClient initialWinners={winnersData} />;
}
