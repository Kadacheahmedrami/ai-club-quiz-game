'use client'

import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-react'

interface WelcomeScreenProps {
  onStartQuiz: () => void
}

export default function WelcomeScreen({ onStartQuiz }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo Section */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-block">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
            <path
              d="M24 28C24 25 26 23 29 23C32 23 34 25 34 28M34 28V36C34 38.2 35.8 40 38 40H42C44.2 40 46 38.2 46 36V32"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="24" cy="44" r="2" fill="currentColor" />
            <circle cx="32" cy="44" r="2" fill="currentColor" />
            <circle cx="40" cy="44" r="2" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
          Bejaia School Of AI
        </h1>
        <p className="text-cyan-400 text-lg font-semibold mb-8">
          Think Deeper • Do Better
        </p>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Welcome to AI Club!
            </h2>
            <p className="text-gray-300 mb-2">
              Test your knowledge about Artificial Intelligence
            </p>
            <p className="text-cyan-400 text-sm">
              5 questions • 20 seconds each
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1">✦</span>
              <p className="text-gray-300">Challenge yourself with AI questions</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1">✦</span>
              <p className="text-gray-300">Compete on the leaderboard</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1">✦</span>
              <p className="text-gray-300">Join our AI learning community</p>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={onStartQuiz}
            className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <PlayIcon size={24} />
            Start Quiz
          </Button>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Good luck! 🚀
          </p>
        </div>
      </div>
    </div>
  )
}
