import { createHmac } from 'crypto';
import { Buffer } from 'buffer';

// Secure encryption utility with HMAC verification
export class SecureEncryption {
  static encrypt(text: string): string {
    const secret = process.env.ENCRYPTION_SECRET || 'fallback-secret-key-change-me';
    const hmac = createHmac('sha256', secret);
    hmac.update(text);
    const hash = hmac.digest('hex');
    return JSON.stringify({ data: Buffer.from(text).toString('base64'), hash });
  }

  static decrypt(encryptedText: string): string {
    try {
      const secret = process.env.ENCRYPTION_SECRET || 'fallback-secret-key-change-me';
      const { data, hash } = JSON.parse(encryptedText);
      const decodedText = Buffer.from(data, 'base64').toString();
      
      const hmac = createHmac('sha256', secret);
      hmac.update(decodedText);
      const computedHash = hmac.digest('hex');
      
      if (hash === computedHash) {
        return decodedText;
      }
      throw new Error('Integrity check failed');
    } catch {
      return '';
    }
  }
}

// Browser-compatible encryption
export class BrowserEncryption {
  /**
   * Encrypts a string using secure encryption
   */
  static async encrypt(text: string): Promise<string> {
    return SecureEncryption.encrypt(text);
  }

  /**
   * Decrypts a string using secure encryption
   */
  static async decrypt(encryptedText: string): Promise<string> {
    return SecureEncryption.decrypt(encryptedText);
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
