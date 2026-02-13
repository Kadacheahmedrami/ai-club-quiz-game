'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import QuizQuestion from './quiz/quiz-question'
import ResultsScreen from './quiz/results-screen'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { saveQuizState, loadQuizState, clearQuizState, QuizState } from '@/lib/quiz-storage'

export interface Question {
  id: number
  question: string
  options: string[]
  // Note: correctAnswer is not included here since it's not sent from the API
  // to prevent cheating
}

type QuizGameProps = {
  userId: string;
};

export default function QuizGame({ userId }: QuizGameProps) {
  const router = useRouter();
  const [gameState, setGameState] = useState<'quiz' | 'results'>(
    'quiz'
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answered, setAnswered] = useState<boolean[]>(Array(0).fill(false)) // Initialize with empty array
  const [answers, setAnswers] = useState<(number | null)[]>([]) // Track selected answer for each question
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false) // New state for submission loading
  const [timerState, setTimerState] = useState<{timeSaved?: number, timeRemaining?: number}>({});

  useEffect(() => {
    // First, check if the user has already taken the quiz
    const checkExistingResult = async () => {
      try {
        const response = await fetch(`/api/quiz/result/${userId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.exists) {
            // User has already taken the quiz, redirect to results page
            router.push('/results');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking existing quiz result:', error);
      }

      // Restore state from localStorage if available
      const savedState = loadQuizState();

      if (savedState && savedState.questions.length > 0) {
        // If we have saved state, use it
        setGameState(savedState.gameState);
        setCurrentQuestion(savedState.currentQuestion);
        setScore(savedState.score);
        setQuestions(savedState.questions);
        setAnswered(savedState.answered);
        setAnswers(savedState.answers);
        // Set timer state if available in saved state
        if (savedState.timeSaved !== undefined && savedState.timeRemaining !== undefined) {
          setTimerState({
            timeSaved: savedState.timeSaved,
            timeRemaining: savedState.timeRemaining
          });
        }
        setLoading(false);
      } else {
        // Otherwise, fetch questions from backend
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
      }
    };

    checkExistingResult();
  }, [userId, router]);

  const handleStartQuiz = () => {
    setGameState('quiz')
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(Array(questions.length).fill(false))
    setAnswers(Array(questions.length).fill(null))
    setTimerState({})
    
    // Save state to localStorage
    saveQuizState({
      gameState: 'quiz',
      currentQuestion: 0,
      score: 0,
      questions,
      answered: Array(questions.length).fill(false),
      answers: Array(questions.length).fill(null)
    });
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
      
      // Save state to localStorage
      saveQuizState({
        gameState,
        currentQuestion,
        score,
        questions,
        answered,
        answers: newAnswers
      });
    }
  }

  const handleNextQuestion = async () => {
    // Mark the current question as answered before proceeding
    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    // Save state to localStorage before proceeding
    saveQuizState({
      gameState,
      currentQuestion,
      score,
      questions,
      answered: newAnswered,
      answers
    });

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      // Reset selected answer for the new question
      setSelectedAnswer(null);
      // Reset timer state for the new question
      setTimerState({});
      
      // Save state to localStorage after moving to next question
      saveQuizState({
        gameState,
        currentQuestion: nextQuestion,
        score,
        questions,
        answered: newAnswered,
        answers
      });
    } else {
      // Set submitting state to show loading screen
      setSubmitting(true);

      // Submit results to backend
      console.log('Attempting to submit quiz, questions length:', questions.length); // Debug log
      console.log('All answers:', answers); // Debug log

      try {
        // Use the userId passed as a prop
        if (!userId) {
          console.error('User not authenticated');
          alert('Please log in to submit the quiz');
          setGameState('results');

          // Save state to localStorage after setting game state to results
          saveQuizState({
            gameState: 'results',
            currentQuestion,
            score,
            questions,
            answered: newAnswered,
            answers
          });

          setSubmitting(false); // Reset submitting state
          return;
        }

        const authenticatedUserId = userId;
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
          
          // Check if the error is due to user already taking the quiz
          if (response.status === 400) {
            try {
              const errorJson = JSON.parse(errorText);
              if (errorJson.error && errorJson.error.includes('already taken the quiz')) {
                alert('You have already taken the quiz. Results will be shown.');
                setGameState('results');
                
                // Save state to localStorage after setting game state to results
                saveQuizState({
                  gameState: 'results',
                  currentQuestion,
                  score,
                  questions,
                  answered: newAnswered,
                  answers,
                  completedAt: Date.now() // Mark when the quiz was completed
                });
                
                setSubmitting(false); // Reset submitting state
                return;
              }
            } catch (parseError) {
              console.error('Error parsing error response:', parseError);
            }
          }
          
          // For other errors, still go to results screen but without scores
          setGameState('results');

          // Save state to localStorage after setting game state to results
          saveQuizState({
            gameState: 'results',
            currentQuestion,
            score,
            questions,
            answered: newAnswered,
            answers
          });

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

      // Save state to localStorage after setting game state to results
      saveQuizState({
        gameState: 'results',
        currentQuestion,
        score,
        questions,
        answered: newAnswered,
        answers,
        completedAt: Date.now() // Mark when the quiz was completed
      });

      setSubmitting(false); // Reset submitting state

      // Navigate to the results page immediately
      router.push('/results');

      // Don't clear the quiz state when quiz is completed so user stays on results screen after refresh
      // Only clear state when user chooses to play again
    }
  }

  const handlePlayAgain = () => {
    clearQuizState(); // Clear the saved state when playing again
    setTimerState({}); // Clear the timer state
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
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-2xl text-white">Loading quiz...</p>
            </div>
          </div>
        ) : gameState === 'quiz' && questions.length > 0 ? (
          <QuizQuestion
            question={questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            score={score}
            selectedAnswer={answers[currentQuestion] ?? null}
            answered={answered[currentQuestion] || false}
            timeSaved={timerState.timeSaved}
            timeRemaining={timerState.timeRemaining}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
            onSaveTimerState={(startTime, timeRemaining) => {
              // Update the timer state in the component
              setTimerState({
                timeSaved: Date.now(),
                timeRemaining
              });

              // Update the saved state with timer information
              saveQuizState({
                gameState,
                currentQuestion,
                score,
                questions,
                answered,
                answers,
                timeSaved: Date.now(),
                timeRemaining
              });
            }}
          />
        ) : gameState === 'results' ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-2xl text-white">Redirecting to results...</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
