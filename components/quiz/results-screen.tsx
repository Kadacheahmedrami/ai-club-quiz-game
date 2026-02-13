'use client'

import { Button } from '@/components/ui/button'
import { RotateCcwIcon, ShareIcon } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ResultsScreenProps {
  score: number
  totalQuestions: number
  onPlayAgain: () => void
  onCloseQuiz?: () => void  // Optional prop to close the quiz
}

export default function ResultsScreen({
  score,
  totalQuestions,
  onPlayAgain,
  onCloseQuiz
}: ResultsScreenProps) {
  const router = useRouter();
  const [showCopied, setShowCopied] = useState(false)
  const percentage = Math.round((score / totalQuestions) * 100)

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      // Navigate back to the quiz page to play again
      router.push('/quiz');
    }
  }

  const getMessage = () => {
    if (percentage === 100) return "🎯 Perfect Score! You're an AI Master!"
    if (percentage >= 80) return '🌟 Excellent! Join the AI Club!'
    if (percentage >= 60) return '🚀 Good Job! Keep Learning AI!'
    if (percentage >= 40) return '💡 Not Bad! Study More AI Concepts!'
    return '📚 Keep Practicing! AI Awaits You!'
  }

  const handleShare = () => {
    const text = `I scored ${score}/${totalQuestions} (${percentage}%) on the Bejaia AI Club Quiz! Can you beat my score? 🚀 #AIClub #ThinkDeeper`
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    })
  }

  const handleCloseQuiz = () => {
    if (onCloseQuiz) {
      onCloseQuiz();
    } else {
      // Fallback navigation if no onCloseQuiz handler is provided
      window.location.href = '/';
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Celebration Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {score === totalQuestions && (
          <>
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-bounce" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100" />
            <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-cyan-300 rounded-full animate-bounce delay-200" />
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl text-center">
          {/* Score Circle */}
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <p className="text-6xl font-bold text-white">{percentage}</p>
                <p className="text-gray-200 text-sm">%</p>
              </div>
            </div>
          </div>

          {/* Results Text */}
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-cyan-400 text-xl font-semibold mb-6">{getMessage()}</p>

          {/* Score Details */}
          <div className="bg-slate-700/30 border border-cyan-500/20 rounded-xl p-6 mb-8">
            <div className="flex justify-around items-center">
              <div>
                <p className="text-gray-400 text-sm mb-1">Score</p>
                <p className="text-2xl font-bold text-cyan-400">{score}</p>
              </div>
              <div className="w-px h-12 bg-cyan-500/20" />
              <div>
                <p className="text-gray-400 text-sm mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{totalQuestions}</p>
              </div>
              <div className="w-px h-12 bg-cyan-500/20" />
              <div>
                <p className="text-gray-400 text-sm mb-1">Correct</p>
                <p className="text-2xl font-bold text-green-400">{score}</p>
              </div>
            </div>
          </div>


          {/* Tagline */}
          <p className="text-gray-300 mb-8">
            Welcome to <span className="text-cyan-400 font-semibold">School of AI - Bejaia</span>
            <br />
            <span className="text-sm">Think Deeper • Do Better</span>
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handlePlayAgain}
              className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcwIcon size={24} />
              Try Again
            </Button>
            <Button
              onClick={handleShare}
              className="w-full py-6 bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <ShareIcon size={24} />
              {showCopied ? 'Copied!' : 'Share Result'}
            </Button>
            <Button
              onClick={handleCloseQuiz}
              variant="outline"
              className="w-full py-6 border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Close Quiz
            </Button>
          </div>

          {/* Footer */}
          <p className="text-gray-400 text-sm mt-8">
            Ready to join our AI learning community?
            <br />
            <span className="text-cyan-400 font-semibold">See you at the next event! 🚀</span>
          </p>
        </div>
      </div>
    </div>
  )
}
