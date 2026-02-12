'use client'

import { useState, useEffect } from 'react'
import WelcomeScreen from './quiz/welcome-screen'
import QuizQuestion from './quiz/quiz-question'
import ResultsScreen from './quiz/results-screen'

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What does AI stand for?',
    options: [
      'Artificial Intelligence',
      'Automated Input',
      'Applied Integration',
      'Advanced Internet'
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: 'Which of these is a machine learning algorithm?',
    options: ['Neural Networks', 'HTTP Protocol', 'CSS Framework', 'JSON Parser'],
    correctAnswer: 0
  },
  {
    id: 3,
    question: 'What is deep learning based on?',
    options: [
      'Biological Neural Networks',
      'Quantum Computing',
      'Cloud Storage',
      'Encryption Keys'
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: 'Which is a popular AI framework?',
    options: ['TensorFlow', 'Bootstrap', 'Django REST', 'Express.js'],
    correctAnswer: 0
  },
  {
    id: 5,
    question: 'What does NLP stand for?',
    options: [
      'Natural Language Processing',
      'Network Layer Protocol',
      'New Learning Platform',
      'Neural Logic Program'
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    question: 'What is supervised learning?',
    options: [
      'Learning with labeled training data',
      'Learning without guidance',
      'Learning supervised by humans only',
      'Learning in a controlled environment'
    ],
    correctAnswer: 0
  },
  {
    id: 7,
    question: 'Which company created ChatGPT?',
    options: ['OpenAI', 'Google', 'Meta', 'Microsoft'],
    correctAnswer: 0
  },
  {
    id: 8,
    question: 'What does CNN stand for in computer vision?',
    options: [
      'Convolutional Neural Network',
      'Connected Network Node',
      'Central Neural Core',
      'Computational Network Code'
    ],
    correctAnswer: 0
  },
  {
    id: 9,
    question: 'Which algorithm is used for classification tasks?',
    options: [
      'Decision Trees',
      'Fast Fourier Transform',
      'File Transfer Protocol',
      'Format Text Parser'
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    question: 'What is reinforcement learning?',
    options: [
      'Learning through rewards and penalties',
      'Learning with predefined rules',
      'Learning from historical data',
      'Learning without any feedback'
    ],
    correctAnswer: 0
  },
  {
    id: 11,
    question: 'Which is a popular Python library for ML?',
    options: ['Scikit-learn', 'jQuery', 'Laravel', 'Ruby on Rails'],
    correctAnswer: 0
  },
  {
    id: 12,
    question: 'What does RNN stand for?',
    options: [
      'Recurrent Neural Network',
      'Random Numerical Network',
      'Real-time Neural Nodes',
      'Recursive Number Network'
    ],
    correctAnswer: 0
  },
  {
    id: 13,
    question: 'Which technique reduces overfitting in neural networks?',
    options: [
      'Dropout',
      'Increasing learning rate',
      'Adding more layers',
      'Removing activation functions'
    ],
    correctAnswer: 0
  },
  {
    id: 14,
    question: 'What is a transformer in AI?',
    options: [
      'A neural network architecture for sequence processing',
      'A device that changes electrical voltage',
      'A robot that changes shape',
      'A method for image compression'
    ],
    correctAnswer: 0
  },
  {
    id: 15,
    question: 'Which is NOT a common activation function?',
    options: [
      'Quadratic',
      'ReLU',
      'Sigmoid',
      'Tanh'
    ],
    correctAnswer: 0
  },
  {
    id: 16,
    question: 'What does GANs stand for?',
    options: [
      'Generative Adversarial Networks',
      'General Analysis Networks',
      'Gradient Aggregation Nodes',
      'Global Attention Modules'
    ],
    correctAnswer: 0
  },
  {
    id: 17,
    question: 'Which metric evaluates classification model accuracy?',
    options: [
      'Confusion Matrix',
      'Velocity Magnitude',
      'Volume Multiplier',
      'Vector Magnitude'
    ],
    correctAnswer: 0
  },
  {
    id: 18,
    question: 'What is backpropagation used for?',
    options: [
      'Training neural networks by calculating gradients',
      'Moving data backward in systems',
      'Storing historical information',
      'Reversing prediction errors'
    ],
    correctAnswer: 0
  },
  {
    id: 19,
    question: 'Which is a common data preprocessing technique?',
    options: [
      'Normalization',
      'Decoration',
      'Defragmentation',
      'Decompilation'
    ],
    correctAnswer: 0
  },
  {
    id: 20,
    question: 'What does the Bejaia School of AI aim to do?',
    options: [
      'Help people think deeper and do better with AI',
      'Only teach programming basics',
      'Provide job placement services',
      'Sell AI products'
    ],
    correctAnswer: 0
  }
]

export default function QuizGame() {
  const [gameState, setGameState] = useState<'welcome' | 'quiz' | 'results'>(
    'welcome'
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const handleStartQuiz = () => {
    setGameState('quiz')
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (answered) return

    setSelectedAnswer(optionIndex)
    setAnswered(true)

    if (optionIndex === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setGameState('results')
    }
  }

  const handlePlayAgain = () => {
    handleStartQuiz()
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* GIF background */}
      {/* <img
        src="/sukuna.gif"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-50  opacity-100"
      /> */}

      {/* Animated background gradient overlay */}
 
      {/* Content */}
      <div className="relative z-10">
        {gameState === 'welcome' && (
          <WelcomeScreen onStartQuiz={handleStartQuiz} />
        )}
        {gameState === 'quiz' && (
          <QuizQuestion
            question={QUIZ_QUESTIONS[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={QUIZ_QUESTIONS.length}
            score={score}
            selectedAnswer={selectedAnswer}
            answered={answered}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
          />
        )}
        {gameState === 'results' && (
          <ResultsScreen
            score={score}
            totalQuestions={QUIZ_QUESTIONS.length}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  )
}
