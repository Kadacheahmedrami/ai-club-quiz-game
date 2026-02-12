import QuizGame from '@/components/quiz-game-wrapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <QuizGame />
    </div>
  );
}
