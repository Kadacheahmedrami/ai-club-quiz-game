import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { quizResults, users } from '@/lib/schema';
import { desc, avg, count, eq } from 'drizzle-orm';

interface QuizResult {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  score: number;
  totalQuestions: number;
  date: string;
}

interface Statistics {
  totalUsers: number;
  totalQuizzesTaken: number;
  averageScore: number;
}

async function getDashboardData() {
  // Direct database query instead of API call
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

  return {
    results,
    statistics: {
      totalUsers,
      totalQuizzesTaken,
      averageScore
    }
  };
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  let results = [];
  let statistics = null;
  let error = '';

  try {
    const data = await getDashboardData();
    results = data.results;
    statistics = data.statistics;
  } catch (err) {
    error = 'An error occurred while fetching dashboard data';
    console.error(err);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">AI Club Quiz Dashboard</h1>
          <p className="text-gray-400">View quiz results and statistics</p>
        </header>

        {/* Stats Overview */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-400">{statistics.totalUsers}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Quizzes Taken</h3>
              <p className="text-3xl font-bold text-green-400">{statistics.totalQuizzesTaken}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Average Score</h3>
              <p className="text-3xl font-bold text-yellow-400">{statistics.averageScore.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Recent Quiz Results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Score</th>
                  <th className="py-3 px-6 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((result) => (
                    <tr key={result.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-4 px-6">{result.userName}</td>
                      <td className="py-4 px-6 text-gray-400">{result.userEmail}</td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-green-400">
                          {result.score}/{result.totalQuestions}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {new Date(result.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 px-6 text-center text-gray-500">
                      No quiz results available yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}