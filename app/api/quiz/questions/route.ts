import { NextRequest, NextResponse } from 'next/server';

// Define the Question interface
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Define quiz questions
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
];

export async function GET(request: NextRequest) {
  try {
    // Return all quiz questions
    return NextResponse.json({ questions: QUIZ_QUESTIONS });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}