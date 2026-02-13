'use client';

import { useRouter } from 'next/navigation';
import WelcomeScreen from '@/components/quiz/welcome-screen';

export default function MainClient() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen ">
      <WelcomeScreen
        onStartQuiz={handleStartQuiz}
        hasTakenQuiz={false}
      />
    </div>
  );
}