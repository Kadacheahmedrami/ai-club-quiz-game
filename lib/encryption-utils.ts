import { Buffer } from 'buffer';

// Simple XOR-based encryption utility for obfuscating data
// Note: This is not cryptographically secure but serves to obfuscate data in transit
export class SimpleEncryption {
  // Public key for XOR encryption - makes it harder to understand the API calls
  private static readonly KEY = 'sa7a-mortada-good-luck-hacking-the-website-try-deashboad-or-leaderboard-routes'; // Public key for obfuscation

  /**
   * Encrypts a string using XOR cipher with a rotating key
   */
  static encrypt(text: string): string {
    const key = this.KEY;
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const encryptedCharCode = charCode ^ keyChar;
      result += String.fromCharCode(encryptedCharCode);
    }
    
    // Convert to base64 to ensure safe transmission
    return Buffer.from(result, 'utf-16le').toString('base64');
  }

  /**
   * Decrypts a string using XOR cipher with a rotating key
   */
  static decrypt(encryptedText: string): string {
    const key = this.KEY;
    
    // Convert from base64
    const decoded = Buffer.from(encryptedText, 'base64').toString('utf-16le');
    
    let result = '';
    
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const decryptedCharCode = charCode ^ keyChar;
      result += String.fromCharCode(decryptedCharCode);
    }
    
    return result;
  }
  
  /**
   * Validates if the encrypted data appears to be properly formatted
   */
  static isValidEncryptedFormat(data: string): boolean {
    try {
      // Check if it's a valid base64 string
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data);
    } catch {
      return false;
    }
  }
}

// Browser-compatible encryption
export class BrowserEncryption {
  /**
   * Encrypts a string using XOR-based encryption
   */
  static async encrypt(text: string): Promise<string> {
    return SimpleEncryption.encrypt(text);
  }

  /**
   * Decrypts a string using XOR-based encryption
   */
  static async decrypt(encryptedText: string): Promise<string> {
    return SimpleEncryption.decrypt(encryptedText);
  }
}

// Validation utility for API data
export class APIValidator {
  /**
   * Validates the structure and content of quiz answers
   */
  static validateQuizAnswers(answers: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(answers)) {
      errors.push('Answers must be an array');
      return { isValid: false, errors };
    }
    
    if (answers.length === 0) {
      errors.push('Answers array cannot be empty');
      return { isValid: false, errors };
    }
    
    if (answers.length > 100) { // Assuming max 100 questions
      errors.push('Too many answers provided');
      return { isValid: false, errors };
    }
    
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      
      if (typeof answer !== 'object' || answer === null) {
        errors.push(`Answer at index ${i} must be an object`);
        continue;
      }
      
      if (typeof answer.questionId !== 'number' || !Number.isInteger(answer.questionId) || answer.questionId <= 0) {
        errors.push(`Invalid questionId at index ${i}: must be a positive integer`);
      }
      
      if (typeof answer.selectedOption !== 'number' || !Number.isInteger(answer.selectedOption) || answer.selectedOption < -1 || answer.selectedOption > 3) {
        errors.push(`Invalid selectedOption at index ${i}: must be an integer between -1 and 3 (where -1 indicates unanswered)`);
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  /**
   * Validates the structure and content of quiz questions
   */
  static validateQuizQuestions(questions: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(questions)) {
      errors.push('Questions must be an array');
      return { isValid: false, errors };
    }
    
    if (questions.length === 0) {
      errors.push('Questions array cannot be empty');
      return { isValid: false, errors };
    }
    
    if (questions.length > 100) { // Assuming max 100 questions
      errors.push('Too many questions provided');
      return { isValid: false, errors };
    }
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (typeof question !== 'object' || question === null) {
        errors.push(`Question at index ${i} must be an object`);
        continue;
      }
      
      if (typeof question.id !== 'number' || !Number.isInteger(question.id) || question.id <= 0) {
        errors.push(`Invalid id at index ${i}: must be a positive integer`);
      }
      
      if (typeof question.question !== 'string' || question.question.trim().length === 0) {
        errors.push(`Invalid question text at index ${i}: must be a non-empty string`);
      }
      
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        errors.push(`Invalid options at index ${i}: must be an array with exactly 4 elements`);
      } else {
        for (let j = 0; j < question.options.length; j++) {
          if (typeof question.options[j] !== 'string' || question.options[j].trim().length === 0) {
            errors.push(`Invalid option at index ${i}, position ${j}: must be a non-empty string`);
          }
        }
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }
}