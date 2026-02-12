'use client'

import { useState, useEffect } from 'react'
import WelcomeScreen from './quiz/welcome-screen'
import QuizQuestion from './quiz/quiz-question'
import ResultsScreen from './quiz/results-screen'
import LoadingSpinner from '@/components/ui/loading-spinner'

export interface Question {
  id: number
  question: string
  options: string[]
  // Note: correctAnswer is not included here since it's not sent from the API
  // to prevent cheating
}

type QuizGameProps = {
  userId: number;
};

export default function QuizGame({ userId }: QuizGameProps) {
  const [gameState, setGameState] = useState<'welcome' | 'quiz' | 'results'>(
    'welcome'
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answered, setAnswered] = useState<boolean[]>(Array(0).fill(false)) // Initialize with empty array
  const [answers, setAnswers] = useState<(number | null)[]>([]) // Track selected answer for each question
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false) // New state for submission loading

  useEffect(() => {
    // Fetch questions from backend
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/quiz/questions');
        const data = await response.json();
        const fetchedQuestions = data.questions;
        setQuestions(fetchedQuestions);
        setAnswered(Array(fetchedQuestions.length).fill(false)); // Initialize answered array with correct length
        setAnswers(Array(fetchedQuestions.length).fill(null)); // Initialize answers array with correct length
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleStartQuiz = () => {
    setGameState('quiz')
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(Array(questions.length).fill(false))
    setAnswers(Array(questions.length).fill(null))
  }

  const handleAnswerSelect = (optionIndex: number) => {
    // Allow changing the answer if clicking a different option
    if (selectedAnswer !== optionIndex) {
      // We can't validate correctness client-side anymore since correctAnswer isn't sent
      // So we just update the selected answer and let the backend handle scoring
      setSelectedAnswer(optionIndex);

      // Update the answers array for the current question
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = optionIndex;
      setAnswers(newAnswers);
    }
  }

  const handleNextQuestion = async () => {
    // Mark the current question as answered before proceeding
    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      // Reset selected answer for the new question
      setSelectedAnswer(null)
    } else {
      // Set submitting state to show loading screen
      setSubmitting(true);
      
      // Submit results to backend
      console.log('Attempting to submit quiz, questions length:', questions.length); // Debug log
      console.log('All answers:', answers); // Debug log

      try {
        // Get the authenticated user ID from the session
        const sessionResponse = await fetch('/api/auth/session');
        const session = await sessionResponse.json();

        if (!session || !session.user?.id) {
          console.error('User not authenticated');
          alert('Please log in to submit the quiz');
          setGameState('results');
          setSubmitting(false); // Reset submitting state
          return;
        }

        const authenticatedUserId = session.user.id;
        console.log('Using authenticated userId:', authenticatedUserId); // Debug log

        // Submit all questions with their selected answers
        const submissionData = questions.map((q, index) => ({
          questionId: q.id,
          selectedOption: answers[index] !== null ? answers[index] : -1 // -1 for unanswered (timed out), actual selection if answered
        }));

        console.log('Submission data:', submissionData); // Debug log

        const response = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: authenticatedUserId,
            answers: submissionData
          }),
        });

        console.log('Response status:', response.status); // Debug log
        if (!response.ok) {
          console.error('Submission failed with status:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          // Still go to results screen but without scores
          setGameState('results');
          setSubmitting(false); // Reset submitting state
          return;
        }

        const result = await response.json();
        console.log('Submission result:', result); // Debug log

        if (result.success) {
          console.log('Quiz submitted successfully');
          setScore(result.score); // Update score in case it's different
        } else {
          console.error('Submission failed:', result);
        }
      } catch (error) {
        console.error('Error submitting quiz:', error);
        // Still go to results screen but without scores
      }

      // Move to results screen after attempting submission
      setGameState('results');
      setSubmitting(false); // Reset submitting state
    }
  }

  const handlePlayAgain = () => {
    handleStartQuiz()
  }

  // Show loading state while fetching questions
  if (loading || questions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* GIF background */}
      <img
        src="/bg.webp"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover md:translate-y-0 -translate-y-1/4 "
      />

      {/* Show loading spinner when submitting */}
      {submitting && <LoadingSpinner />}

      {/* Content */}
      <div className={`${submitting ? 'opacity-0 pointer-events-none' : ''} relative z-10`}>
        {gameState === 'welcome' && (
          <WelcomeScreen onStartQuiz={handleStartQuiz} />
        )}
        {gameState === 'quiz' && (
          <QuizQuestion
            question={questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            score={score}
            selectedAnswer={answers[currentQuestion] ?? null}
            answered={answered[currentQuestion] || false}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
          />
        )}
        {gameState === 'results' && (
          <ResultsScreen
            score={score}
            totalQuestions={questions.length}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  )
}
