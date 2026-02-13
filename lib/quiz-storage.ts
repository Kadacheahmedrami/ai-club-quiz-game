// Utility functions for saving and loading quiz state to/from localStorage

export interface QuizState {
  gameState: 'welcome' | 'quiz' | 'results';
  currentQuestion: number;
  score: number;
  questions: any[]; // Using any since we're not importing the Question type here
  answered: boolean[];
  answers: (number | null)[];
  timeSaved?: number; // Timestamp when the timer state was saved
  timeRemaining?: number; // Time remaining for the current question at the time of saving
  completedAt?: number; // Timestamp when the quiz was completed
}

const QUIZ_STORAGE_KEY = 'ai-club-quiz-state';

/**
 * Save quiz state to localStorage
 */
export function saveQuizState(state: QuizState): void {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving quiz state to localStorage:', error);
  }
}

/**
 * Load quiz state from localStorage
 */
export function loadQuizState(): QuizState | null {
  try {
    const storedState = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      
      // Check if the quiz was completed and if it's older than 24 hours
      if (parsedState.completedAt && parsedState.gameState === 'results') {
        const currentTime = Date.now();
        const timeDiff = currentTime - parsedState.completedAt;
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // If the completed quiz is older than 24 hours, clear it and return null
        if (timeDiff > twentyFourHours) {
          clearQuizState();
          return null;
        }
      }
      
      return parsedState;
    }
    return null;
  } catch (error) {
    console.error('Error loading quiz state from localStorage:', error);
    return null;
  }
}

/**
 * Clear quiz state from localStorage
 */
export function clearQuizState(): void {
  try {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing quiz state from localStorage:', error);
  }
}