'use client';

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import QuizQuestion from './quiz/quiz-question'
import ResultsScreen from './quiz/results-screen'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { QuizState, loadQuizState, saveQuizState, clearQuizState } from '@/lib/quiz-storage'

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

  // Initialize state from localStorage if available
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answered, setAnswered] = useState<boolean[]>([]) // Initialize with empty array
  const [answers, setAnswers] = useState<(number | null)[]>([]) // Track selected answer for each question
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false) // New state for submission loading
  const [timerState, setTimerState] = useState<{timeSaved?: number, timeRemaining?: number}>({});
  
  // Flag to prevent re-initialization after submission starts
  const submissionStartedRef = useRef(false);

  useEffect(() => {
    // Prevent re-execution if submission has already started
    if (submissionStartedRef.current) {
      return;
    }

    // First, check the database to see if the user has already taken the quiz
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch(`/api/quiz/result/${userId}`);

        if (response.ok) {
          const result = await response.json();
          if (result.exists) {
            // User has already taken the quiz in the database, redirect to results
            // and clear any local storage that might conflict
            clearQuizState();
            router.push('/results');
            setLoading(false);
            return;
          }
        } else {
          // If there's an error checking the result, redirect to results page
          router.push('/results');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error checking quiz result in database:', error);
        router.push('/results');
        setLoading(false);
        return;
      }

      // If user hasn't taken the quiz in the database, proceed with loading local state
      // Load quiz state from localStorage if available
      const savedState = loadQuizState();

      if (savedState && savedState.gameState === 'quiz') {
        // Restore the quiz state
        setCurrentQuestion(savedState.currentQuestion);
        setScore(savedState.score);
        setQuestions(savedState.questions);
        setAnswered(savedState.answered);
        setAnswers(savedState.answers);

        // Set timer state if available
        if (savedState.timeSaved !== undefined && savedState.timeRemaining !== undefined) {
          setTimerState({
            timeSaved: savedState.timeSaved,
            timeRemaining: savedState.timeRemaining
          });
        }

        setLoading(false);
      } else if (savedState && savedState.gameState === 'results') {
        // If the user has already completed the quiz in local storage, verify with database
        const verifyResult = async () => {
          try {
            const response = await fetch(`/api/quiz/result/${userId}`);

            if (response.ok) {
              const result = await response.json();
              if (!result.exists) {
                // If the result doesn't exist in the database, clear the local state and allow retaking the quiz
                clearQuizState();
                const fetchQuestions = async () => {
                  try {
                    const response = await fetch('/api/quiz/questions');

                    if (!response.ok) {
                      const errorData = await response.json();

                      if (response.status === 400 && errorData.alreadyTaken) {
                        // User has already taken the quiz, redirect to results page
                        router.push('/results');
                        return;
                      } else if (response.status === 401) {
                        // Unauthorized, redirect to login
                        router.push('/login');
                        return;
                      }

                      throw new Error(errorData.error || 'Failed to fetch questions');
                    }

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
              } else {
                // Result exists in DB, redirect to results page
                router.push('/results');
              }
            } else {
              // If there's an error verifying the result, redirect to results page
              router.push('/results');
            }
          } catch (error) {
            console.error('Error verifying quiz result:', error);
            router.push('/results');
          }
        };

        verifyResult();
      } else {
        // Fetch questions from backend if no saved state
        const fetchQuestions = async () => {
          try {
            const response = await fetch('/api/quiz/questions');

            if (!response.ok) {
              const errorData = await response.json();

              if (response.status === 400 && errorData.alreadyTaken) {
                // User has already taken the quiz, redirect to results page
                router.push('/results');
                return;
              } else if (response.status === 401) {
                // Unauthorized, redirect to login
                router.push('/login');
                return;
              }

              throw new Error(errorData.error || 'Failed to fetch questions');
            }

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

    checkDatabaseStatus();
  }, [userId, router]);


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

      // Save the updated state to localStorage
      saveQuizState({
        gameState: 'quiz',
        currentQuestion,
        score,
        questions,
        answered,
        answers: newAnswers,
        timeSaved: timerState.timeSaved,
        timeRemaining: timerState.timeRemaining
      });
    }
  }

  const handleNextQuestion = async () => {
    // Update the answers array with the currently selected answer before proceeding
    const newAnswers = [...answers];
    if (selectedAnswer !== null) {
      newAnswers[currentQuestion] = selectedAnswer; // Use the selected answer
    } else {
      newAnswers[currentQuestion] = -1; // Mark as unanswered if no selection was made
    }
    setAnswers(newAnswers);

    // Mark the current question as answered before proceeding
    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      // Reset selected answer for the new question
      setSelectedAnswer(null);
      // Reset timer state for the new question
      setTimerState({});

      // Save the updated state to localStorage
      saveQuizState({
        gameState: 'quiz',
        currentQuestion: nextQuestion,
        score,
        questions,
        answered: newAnswered,
        answers: newAnswers,
        timeSaved: undefined,
        timeRemaining: undefined
      });
    } else {
      // Prevent multiple submissions
      if (submitting) return;

      // Clear the quiz state before submitting to prevent any issues
      clearQuizState();
      console.log('Local storage cleared before submission'); // Debug log

      // Set the submission started flag to prevent re-initialization
      submissionStartedRef.current = true;
      
      // Set submitting state to show loading screen
      setSubmitting(true);

      // Submit results to backend
      console.log('Attempting to submit quiz, questions length:', questions.length); // Debug log
      console.log('All answers:', newAnswers); // Debug log

      try {
        // Use the userId passed as a prop
        if (!userId) {
          console.error('User not authenticated');
          alert('Please log in to submit the quiz');
          setSubmitting(false); // Reset submitting state
          return;
        }

        const authenticatedUserId = userId;
        console.log('Using authenticated userId:', authenticatedUserId); // Debug log

        // Submit all questions with their selected answers
        const submissionData = questions.map((q, index) => ({
          questionId: q.id,
          selectedOption: newAnswers[index] !== null ? newAnswers[index] : -1 // -1 for unanswered (timed out), actual selection if answered
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
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.error('Could not parse error response:', parseError);
          }
          console.error('Error response:', errorData);

          // Check if the error is due to user already taking the quiz
          if (response.status === 400 && errorData.alreadyTaken) {
            // User has already taken the quiz, clear local storage and redirect to results page
            clearQuizState(); // Clear any local state that might cause resubmission
            setSubmitting(false); // Reset submitting state
            router.push('/results');
            return;
          }

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
      }

      // Always reset submitting state regardless of success/failure
      setSubmitting(false);

      // Navigate to the results page immediately
      router.push('/results');
    }
  }

  const handleTimerEnd = async () => {
    // Prevent multiple submissions
    if (submitting) return;

    // When timer ends, check if the user had already selected an answer
    // If they did, use that answer; otherwise, mark as unanswered (-1)
    const newAnswers = [...answers];
    
    // Use the currently selected answer if available, otherwise mark as unanswered
    if (selectedAnswer !== null) {
      newAnswers[currentQuestion] = selectedAnswer; // Use the selected answer
    } else {
      newAnswers[currentQuestion] = -1; // Mark as unanswered
    }
    setAnswers(newAnswers);

    // Mark the current question as answered
    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    // If this is the last question, submit the quiz automatically
    if (currentQuestion === questions.length - 1) {
      // Clear the quiz state before submitting to prevent any issues
      clearQuizState();
      console.log('Local storage cleared before submission'); // Debug log

      // Set the submission started flag to prevent re-initialization
      submissionStartedRef.current = true;
      
      // Set submitting state to show loading screen
      setSubmitting(true);

      // Submit results to backend
      console.log('Attempting to submit quiz after timer ended, questions length:', questions.length); // Debug log
      console.log('All answers:', newAnswers); // Debug log

      try {
        // Use the userId passed as a prop
        if (!userId) {
          console.error('User not authenticated');
          alert('Please log in to submit the quiz');
          setSubmitting(false); // Reset submitting state
          return;
        }

        const authenticatedUserId = userId;
        console.log('Using authenticated userId:', authenticatedUserId); // Debug log

        // Submit all questions with their selected answers
        const submissionData = questions.map((q, index) => ({
          questionId: q.id,
          selectedOption: newAnswers[index] !== null ? newAnswers[index] : -1 // -1 for unanswered (timed out), actual selection if answered
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
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.error('Could not parse error response:', parseError);
          }
          console.error('Error response:', errorData);

          // Check if the error is due to user already taking the quiz
          if (response.status === 400 && errorData.alreadyTaken) {
            // User has already taken the quiz, clear local storage and redirect to results page
            clearQuizState(); // Clear any local state that might cause resubmission
            setSubmitting(false); // Reset submitting state
            router.push('/results');
            return;
          }

          setSubmitting(false); // Reset submitting state
          return;
        }

        const result = await response.json();
        console.log('Submission result:', result); // Debug log

        if (result.success) {
          console.log('Quiz submitted successfully after timer ended');
          setScore(result.score); // Update score in case it's different
        } else {
          console.error('Submission failed:', result);
        }
      } catch (error) {
        console.error('Error submitting quiz after timer ended:', error);
      }

      // Always reset submitting state regardless of success/failure
      setSubmitting(false);

      // Navigate to the results page immediately
      router.push('/results');
    } else {
      // If it's not the last question, move to the next question
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      // Reset selected answer for the new question
      setSelectedAnswer(null);
      // Reset timer state for the new question
      setTimerState({});

      // Save the updated state to localStorage
      saveQuizState({
        gameState: 'quiz',
        currentQuestion: nextQuestion,
        score,
        questions,
        answered: newAnswered,
        answers: newAnswers,
        timeSaved: undefined,
        timeRemaining: undefined
      });
    }
  }

  const handlePlayAgain = () => {
    // Clear the saved quiz state and reload the page to restart the quiz
    saveQuizState({
      gameState: 'welcome',
      currentQuestion: 0,
      score: 0,
      questions: [],
      answered: [],
      answers: []
    });
    window.location.reload();
  }

  // Show loading state while fetching questions
  if (loading || questions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Show loading spinner when submitting */}
      {submitting && <LoadingSpinner />}

      {/* Content */}
      <div className={`${submitting ? 'opacity-0 pointer-events-none' : ''} relative z-10`}>
        {questions.length > 0 ? (
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
            onTimerEnd={handleTimerEnd}
            onSaveTimerState={(startTime, timeRemaining) => {
              // Update the timer state in the component
              const newTimerState = {
                timeSaved: Date.now(),
                timeRemaining
              };
              setTimerState(newTimerState);

              // Save the updated state to localStorage
              saveQuizState({
                gameState: 'quiz',
                currentQuestion,
                score,
                questions,
                answered,
                answers,
                timeSaved: newTimerState.timeSaved,
                timeRemaining: newTimerState.timeRemaining
              });
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
