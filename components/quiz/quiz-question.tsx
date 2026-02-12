'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronRightIcon } from 'lucide-react'
import type { Question } from '../quiz-game'

interface QuizQuestionProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  score: number
  selectedAnswer: number | null
  answered: boolean
  onAnswerSelect: (optionIndex: number) => void
  onNextQuestion: () => void
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  score,
  selectedAnswer,
  answered,
  onAnswerSelect,
  onNextQuestion
}: QuizQuestionProps) {
  const [timeLeft, setTimeLeft] = useState(20)

  useEffect(() => {
    setTimeLeft(20)
  }, [question.id])

  useEffect(() => {
    if (answered) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [answered, question.id])

  const isCorrect = selectedAnswer === question.correctAnswer
  const timePercentage = (timeLeft / 20) * 100

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
            <p className="text-2xl font-bold text-cyan-400">{score} / {totalQuestions}</p>
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
            <span className={`text-xs font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-cyan-400'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5
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
            {question.options.map((option, index) => {
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
                  disabled={answered}
                  className={`w-full p-4 text-left border rounded-xl transition-all duration-300 flex items-center justify-between group ${buttonStyle} ${
                    answered ? 'cursor-default' : 'cursor-pointer'
                  }`}
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
        {answered && (
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
