'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ResultsScreen from '@/components/quiz/results-screen';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { clearQuizState } from '@/lib/quiz-storage';

interface ResultsClientProps {
  userId: string | undefined;
}

export default function ResultsClient({ userId }: ResultsClientProps) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any local storage when the results page loads
    clearQuizState();

    // Fetch the user's quiz results from the database
    if (userId) {
      const fetchResults = async () => {
        try {
          const response = await fetch(`/api/quiz/result/${userId}`);
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
      // If no userId, redirect to login
      router.push('/login');
    }
  }, [userId, router]);

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
    <div className="min-h-screen ">
      <ResultsScreen
        score={score}
        totalQuestions={totalQuestions}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}