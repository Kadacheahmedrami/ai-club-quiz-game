import fs from 'fs';
import path from 'path';

// Define the Question type
export type Question = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer_index: string;
};

/**
 * Reads questions from a CSV file and returns them as an array of Question objects
 */
export function readQuestionsFromCSV(filePath: string): Question[] {
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.split('\n');
  
  // Skip the header line
  const headers = lines[0].split(',').map(header => header.trim());
  const questions: Question[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    // Handle potential commas inside quoted fields
    const row = parseCSVLine(line);
    
    if (row.length >= 7) {
      const question: Question = {
        id: row[0],
        question: row[1],
        option_a: row[2],
        option_b: row[3],
        option_c: row[4],
        option_d: row[5],
        correct_answer_index: row[6],
      };
      
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Parses a single CSV line, handling quoted fields that may contain commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Toggle quote state
      if (insideQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Double quotes inside quoted field represent a single quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      result.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Add the last field
  result.push(currentField.trim());
  
  return result;
}

/**
 * Selects a random subset of questions from the full list
 */
export function getRandomQuestions(questions: Question[], count: number): Question[] {
  if (count >= questions.length) {
    return [...questions]; // Return all questions if count is greater than or equal to total
  }
  
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}