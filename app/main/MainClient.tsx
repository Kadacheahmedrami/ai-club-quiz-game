'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/quiz/welcome-screen';

interface MainClientProps {
  userId: string | undefined;
}

export default function MainClient({ userId }: MainClientProps) {
  const router = useRouter();
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);

  useEffect(() => {
    // Check if the user has already taken the quiz
    if (userId) {
      const checkQuizStatus = async () => {
        try {
          const response = await fetch(`/api/quiz/result/${userId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.exists) {
              setHasTakenQuiz(true);
            }
          }
        } catch (error) {
          console.error('Error checking quiz status:', error);
        }
      };

      checkQuizStatus();
    }
  }, [userId]);

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  const handleViewResults = () => {
    router.push('/results');
  };

  const handleRetakeQuiz = () => {
    // In the current implementation, we don't allow retaking the quiz
    // But we could implement this differently if needed
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-black">
      <WelcomeScreen 
        onStartQuiz={hasTakenQuiz ? handleRetakeQuiz : handleStartQuiz} 
        hasTakenQuiz={hasTakenQuiz}
      />
    </div>
  );
}