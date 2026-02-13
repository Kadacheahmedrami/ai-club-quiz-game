'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronRightIcon } from 'lucide-react'
import type { Question } from '@/components/quiz-game-client'

interface QuizQuestionProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  score: number
  selectedAnswer: number | null
  answered: boolean
  timeSaved?: number
  timeRemaining?: number
  onAnswerSelect: (optionIndex: number) => void
  onNextQuestion: () => void
  onSaveTimerState: (startTime: number, timeRemaining: number) => void
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  score,
  selectedAnswer,
  answered,
  timeSaved: propTimeSaved,
  timeRemaining: propTimeRemaining,
  onAnswerSelect,
  onNextQuestion,
  onSaveTimerState
}: QuizQuestionProps) {
  const [rawTimeLeft, setRawTimeLeft] = useState<number>(20) // Start with full time
  const [displayTimeLeft, setDisplayTimeLeft] = useState<number>(20) // Start with full time
  const [startTime, setStartTime] = useState<number>(Date.now())
  const timerActiveRef = useRef<boolean>(true); // Track if timer should be active

  // Effect to handle timer initialization and reset when question changes
  useEffect(() => {
    // Calculate the actual remaining time based on saved state
    let initialTimeRemaining = 20; // Default 20 seconds
    const currentTime = Date.now();

    // If we have saved timer state, calculate the actual remaining time
    if (propTimeSaved !== undefined && propTimeRemaining !== undefined) {
      // Calculate how much time has passed since the timer state was saved
      const timePassedSinceSave = (currentTime - propTimeSaved) / 1000;
      // Calculate actual remaining time
      const calculatedTimeLeft = Math.max(0, propTimeRemaining - timePassedSinceSave);

      if (calculatedTimeLeft <= 0) {
        // If time has already expired since last save, move to next question immediately
        timerActiveRef.current = false;
        onNextQuestion();
        return;
      }

      // Use the calculated remaining time
      initialTimeRemaining = calculatedTimeLeft;
    }

    // Set the initial state based on calculated time
    setStartTime(currentTime);
    setRawTimeLeft(initialTimeRemaining);
    setDisplayTimeLeft(Math.ceil(initialTimeRemaining));
    timerActiveRef.current = true; // Activate timer when question loads

    const duration = initialTimeRemaining * 1000; // Duration in milliseconds based on remaining time

    let animationFrameId: number;

    const updateTimer = () => {
      // Only continue if timer is still active
      if (!timerActiveRef.current) return;

      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, initialTimeRemaining - elapsed);
      const rawSecondsLeft = remaining;

      setRawTimeLeft(rawSecondsLeft);
      // Update display time only when the integer part changes to avoid flickering
      setDisplayTimeLeft(prev => {
        const newDisplayTime = Math.ceil(rawSecondsLeft);
        return newDisplayTime !== Math.ceil(prev) ? newDisplayTime : prev;
      });

      if (rawSecondsLeft <= 0) {
        // Automatically move to next question when timer ends
        timerActiveRef.current = false; // Deactivate timer before moving to next question
        onNextQuestion();
      } else {
        // Save timer state: save the current time and the remaining time
        onSaveTimerState(Date.now(), rawSecondsLeft);
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(animationFrameId);
      timerActiveRef.current = false; // Ensure timer is deactivated when component unmounts
    };
  }, [question.id, propTimeSaved, propTimeRemaining, onSaveTimerState]); // Include propTimeSaved and propTimeRemaining in dependencies

  // Calculate time percentage based on actual elapsed time for smoother animation
  const elapsed = (Date.now() - startTime) / 1000;
  const timePercentage = Math.max(0, (rawTimeLeft / 20) * 100) // Always calculate based on 20 seconds per question
  
  // Determine if time is running low for styling
  const isTimeLow = rawTimeLeft <= 5;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        {/* Score and Question Counter */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <p className="text-sm text-gray-400">Question</p>
            <p className="text-2xl font-bold">
              {questionNumber} <span className="text-gray-500">/ {totalQuestions}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-2xl font-bold text-cyan-400"> ? / {totalQuestions}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs text-gray-400">{((questionNumber / totalQuestions) * 100).toFixed(0)}%</span>
          </div>
          <Progress
            value={(questionNumber / totalQuestions) * 100}
            className="h-2 bg-slate-700"
          />
        </div>

        {/* Timer Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Time Remaining</span>
            <span className={`text-xs font-bold ${isTimeLow ? 'text-red-400' : 'text-cyan-400'}`}>
              {displayTimeLeft}s
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                isTimeLow
                  ? 'bg-gradient-to-r from-red-500 to-red-400'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-balance">
            {question.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {question.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index
              let buttonStyle =
                'border-cyan-500/30 hover:border-cyan-500/60 hover:bg-slate-700/30'

              if (isSelected) {
                buttonStyle = 'border-cyan-500 bg-cyan-500/20'
              }

              return (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  disabled={false} // Allow changing answers until moving to next question
                  className={`w-full p-4 text-left border rounded-xl transition-all duration-300 flex items-center justify-between group ${buttonStyle} cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-400 group-hover:text-cyan-400 transition-colors">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Next Button */}
        {selectedAnswer !== null && (
          <Button
            onClick={onNextQuestion}
            className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {questionNumber === totalQuestions ? 'See Results' : 'Next Question'}
            <ChevronRightIcon size={24} />
          </Button>
        )}
      </div>
    </div>
  )
}
