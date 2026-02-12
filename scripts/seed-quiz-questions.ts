import { seedQuizQuestions } from '../lib/quiz-utils';

async function main() {
  try {
    console.log('Seeding quiz questions...');
    await seedQuizQuestions();
    console.log('Quiz questions seeded successfully!');
  } catch (error) {
    console.error('Error seeding quiz questions:', error);
    process.exit(1);
  }
}

main();