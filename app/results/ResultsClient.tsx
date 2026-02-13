'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ResultsScreen from '@/components/quiz/results-screen';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { clearQuizState } from '@/lib/quiz-storage';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ResultsClientProps {
  user: User | undefined;
}

export default function ResultsClient({ user }: ResultsClientProps) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any local storage when the results page loads
    clearQuizState();

    // Fetch the user's quiz results from the database
    if (user?.id) {
      const fetchResults = async () => {
        try {
          // Fetch the user's quiz results
          const response = await fetch(`/api/quiz/result/${user.id}`);
          if (response.ok) {
            const result = await response.json();
            if (result.exists) {
              setScore(result.score);
              setTotalQuestions(result.totalQuestions);
            } else {
              // If user hasn't taken the quiz, redirect to the quiz page
              router.push('/quiz');
              return;
            }
          } else {
            // If there's an error fetching results, redirect to quiz
            router.push('/quiz');
            return;
          }
        } catch (error) {
          console.error('Error fetching quiz results:', error);
          // On error, redirect to quiz page
          router.push('/quiz');
          return;
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    } else {
      // If no user, redirect to login
      router.push('/login');
    }
  }, [user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handlePlayAgain = () => {
    clearQuizState(); // Clear any local storage when playing again
    router.push('/quiz');
  };

  const handleCloseQuiz = () => {
    router.push('/main');
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ResultsScreen
          score={score}
          totalQuestions={totalQuestions}
          onPlayAgain={handlePlayAgain}
          userName={user?.name ?? undefined}
        />
      </div>
    </div>
  );
}