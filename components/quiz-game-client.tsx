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
      // If previously answered correctly, adjust the score
      if (selectedAnswer === questions[currentQuestion]?.correctAnswer && optionIndex !== questions[currentQuestion]?.correctAnswer) {
        setScore(score - 1); // Remove the previous correct answer from score
      } 
      // If changing from incorrect to correct answer, increase score
      else if (selectedAnswer !== questions[currentQuestion]?.correctAnswer && optionIndex === questions[currentQuestion]?.correctAnswer) {
        setScore(score + 1); // Add the correct answer to score
      }
      
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
      // Submit results to backend
      if (userId) {
        try {
          // Submit all questions with their selected answers
          const submissionData = questions.map((q, index) => ({
            questionId: q.id,
            selectedOption: answers[index] !== null ? answers[index] : -1 // -1 for unanswered (timed out), actual selection if answered
          }));

          // Get session to access the token
          const sessionResponse = await fetch('/api/auth/session');
          const session = await sessionResponse.json();

          const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              answers: submissionData
            }),
          });

          const result = await response.json();
          if (result.success) {
            console.log('Quiz submitted successfully');
          }
        } catch (error) {
          console.error('Error submitting quiz:', error);
        }
      }

      setGameState('results')
    }
  }

  const handlePlayAgain = () => {
    handleStartQuiz()
  }

  // Show loading state while fetching questions
  if (loading || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white text-xl">Loading quiz questions...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* GIF background */}
      <img
        src="/bg.webp"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover md:translate-y-0 -translate-y-1/4 "
      />

 

      {/* Content */}
      <div className="relative z-10">
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
