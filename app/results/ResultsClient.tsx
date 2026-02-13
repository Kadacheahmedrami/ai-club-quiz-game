'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ResultsScreen from '@/components/quiz/results-screen';

interface ResultsClientProps {
  userId: string | undefined;
}

export default function ResultsClient({ userId }: ResultsClientProps) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            }
          }
        } catch (error) {
          console.error('Error fetching quiz results:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-white">Loading results...</p>
        </div>
      </div>
    );
  }

  const handlePlayAgain = () => {
    router.push('/quiz');
  };

  const handleCloseQuiz = () => {
    router.push('/main');
  };

  return (
    <div className="min-h-screen bg-black">
      <ResultsScreen 
        score={score} 
        totalQuestions={totalQuestions} 
        onPlayAgain={handlePlayAgain}
        onCloseQuiz={handleCloseQuiz}
      />
    </div>
  );
}