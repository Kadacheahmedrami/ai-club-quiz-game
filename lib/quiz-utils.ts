import { db } from '@/lib/db';
import { quizQuestions } from '@/lib/schema';
import { eq, inArray } from 'drizzle-orm';

// Define the Question interface for client-side use (without correct answer to prevent cheating)
export interface ClientQuestion {
  id: number;
  question: string;
  options: string[];
}

// Define the Question interface for server-side use (with correct answer)
interface ServerQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}


// Function to seed quiz questions to the database
export async function seedQuizQuestions() {
  try {
    // Check if questions already exist in the database
    const existingQuestions = await db.select().from(quizQuestions);
    
    if (existingQuestions.length > 0) {
      console.log('Quiz questions already exist in the database');
      return;
    }

    // Insert the quiz questions into the database
    for (const questionData of QUIZ_QUESTIONS) {
      await db.insert(quizQuestions).values({
        question: questionData.question,
        option1: questionData.options[0],
        option2: questionData.options[1],
        option3: questionData.options[2],
        option4: questionData.options[3],
        correctAnswerIndex: questionData.correctAnswer,
      });
    }

    console.log(`Successfully seeded ${QUIZ_QUESTIONS.length} quiz questions to the database`);
  } catch (error) {
    console.error('Error seeding quiz questions:', error);
    throw error;
  }
}

// Function to get all quiz questions from the database for client use (without correct answers)
export async function getAllQuizQuestionsForClient() {
  try {
    const questions = await db.select().from(quizQuestions);
    
    // Format the questions without correct answers to prevent cheating
    return questions.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.option1, q.option2, q.option3, q.option4],
    }));
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
}

// Function to get all quiz questions from the database for server use (with correct answers)
export async function getAllQuizQuestionsForServer() {
  try {
    const questions = await db.select().from(quizQuestions);
    
    // Format the questions with correct answers for server-side validation
    return questions.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.option1, q.option2, q.option3, q.option4],
      correctAnswer: q.correctAnswerIndex,
    }));
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
}

// Function to get a specific quiz question by ID for server use (with correct answer)
export async function getQuizQuestionById(id: number) {
  try {
    const question = await db.select().from(quizQuestions).where(eq(quizQuestions.id, id)).limit(1);
    
    if (question.length === 0) {
      return null;
    }

    const q = question[0];
    return {
      id: q.id,
      question: q.question,
      options: [q.option1, q.option2, q.option3, q.option4],
      correctAnswer: q.correctAnswerIndex,
    };
  } catch (error) {
    console.error('Error fetching quiz question:', error);
    throw error;
  }
}

// Function to validate answers against the database
export async function validateAnswers(answers: { questionId: number; selectedOption: number }[]) {
  try {
    // Get all questions with their correct answers for validation
    const allQuestions = await getAllQuizQuestionsForServer();
    
    // Create a map of question ID to correct answer index
    const correctAnswersMap = new Map<number, number>();
    allQuestions.forEach(q => {
      correctAnswersMap.set(q.id, q.correctAnswer);
    });

    // Validate each answer
    const validatedAnswers = answers.map(answer => {
      const correctAnswer = correctAnswersMap.get(answer.questionId);
      const isCorrect = answer.selectedOption === correctAnswer;
      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
        correctAnswer // Only for internal validation, not sent to client
      };
    });

    return validatedAnswers;
  } catch (error) {
    console.error('Error validating answers:', error);
    throw error;
  }
}