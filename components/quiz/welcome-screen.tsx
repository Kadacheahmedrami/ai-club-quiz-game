'use client'

import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-react'

interface WelcomeScreenProps {
  onStartQuiz: () => void
  hasTakenQuiz?: boolean
}

export default function WelcomeScreen({ onStartQuiz,  hasTakenQuiz = false }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo Section */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-block">
          <img 
            src="/logo.svg" 
            alt="AI Club Logo" 
            width={128} 
            height={128} 
            className="drop-shadow-lg mx-auto"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
          {hasTakenQuiz ? 'AI Quiz Completed!' : 'School Of AI - Bejaia'}
        </h1>
        <p className="text-cyan-400 text-lg font-semibold mb-8">
          {hasTakenQuiz ? 'View your results below' : 'Think Deeper • Do Better'}
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
              20 questions • 20 seconds each
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
            {hasTakenQuiz ? 'Review Quiz' : 'Start Quiz'}
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
