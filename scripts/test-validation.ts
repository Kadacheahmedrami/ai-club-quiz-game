import { validateAnswers } from '../lib/quiz-utils';

async function testValidation() {
  try {
    console.log('Testing answer validation...');
    
    // Test with some sample answers
    const testAnswers = [
      { questionId: 1, selectedOption: 0 }, // Correct answer for question 1
      { questionId: 2, selectedOption: 1 }, // Wrong answer for question 2
      { questionId: 3, selectedOption: 0 }, // Correct answer for question 3
    ];
    
    const results = await validateAnswers(testAnswers);
    
    console.log('Validation results:');
    results.forEach(result => {
      console.log(`Question ${result.questionId}: Selected option ${result.selectedOption}, Is correct: ${result.isCorrect}`);
    });
    
    const score = results.filter(r => r.isCorrect).length;
    console.log(`Score: ${score}/${results.length}`);
    
  } catch (error) {
    console.error('Error in validation test:', error);
  }
}

testValidation();