import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import QuizGameClient from './quiz-game-client';

export default async function QuizGameWrapper() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    // This shouldn't happen since the page is already protected,
    // but as a fallback we can return an error state
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white text-xl">Authentication error</div>
      </div>
    );
  }

  // Pass the user ID to the client component
  return <QuizGameClient userId={Number(session.user.id)} />;
}