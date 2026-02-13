import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizResults, users, quizQuestions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TEST_MODE } from '../test';
import { SimpleEncryption, APIValidator } from '@/lib/encryption-utils';

interface AnswerSubmission {
  userId: string | number; // Accept both string and number to handle different client implementations
  answers: {
    questionId: number;
    selectedOption: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user using NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Check if data is encrypted
    if (body.data) {
      try {
        // Decrypt the incoming data
        const decryptedData = SimpleEncryption.decrypt(body.data);
        const parsedData = JSON.parse(decryptedData);
        
        // Validate the structure of the decrypted data
        if (!parsedData.userId || !parsedData.answers) {
          return NextResponse.json({ error: 'Invalid encrypted data format' }, { status: 400 });
        }
        
        var { userId, answers } = parsedData;
      } catch (decryptError) {
        console.error('Error decrypting data:', decryptError);
        return NextResponse.json({ error: 'Invalid encrypted data' }, { status: 400 });
      }
    } else {
      // Handle unencrypted data for backward compatibility
      const { userId, answers } = body;
      var userIdVar = userId;
      var answersVar = answers;
    }
    
    // Use the variables defined above
    const userIdFinal = userIdVar !== undefined ? userIdVar : userId;
    const answersFinal = answersVar !== undefined ? answersVar : answers;

    // Verify that the userId in the request matches the authenticated user's ID
    if (session.user?.id !== userIdFinal.toString()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid user ID' }, { status: 401 });
    }

    // Use the authenticated user's ID from the session
    const userIdString = session.user.id;

    console.log('Authenticated userId:', userIdString);

    console.log('Submitting answers:', answersFinal); // Debug log

    // Check if the user has already taken the quiz
    const existingResult = await db.select()
      .from(quizResults)
      .where(eq(quizResults.userId, userIdString))
      .limit(1);

    if (existingResult.length > 0) {
      // User has already taken the quiz, return an error
      return NextResponse.json({
        error: 'User has already taken the quiz and cannot submit again',
        alreadyTaken: true
      }, { status: 400 });
    }

    const testMode = TEST_MODE; // Use the common test mode variable

    // Validate the answers structure and content
    const validation = APIValidator.validateQuizAnswers(answersFinal);
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      return NextResponse.json({ 
        error: 'Invalid answers format', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Total number of questions in the quiz
    let totalQuestions = answersFinal.length;

    // If in test mode, only process the first 3 questions (or however many were sent)
    let filteredAnswers = answersFinal;
    if (testMode) {
      // In test mode, we only evaluate the questions that were sent
      // This means totalQuestions should be the number of questions sent
      totalQuestions = answersFinal.length;
    }

    // Process all answers (including unanswered ones)
    let score = 0;
    const processedAnswers = [];

    for (const answer of filteredAnswers) {
      if (answer.selectedOption === -1) {
        // Unanswered question - mark as incorrect
        processedAnswers.push({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: false
        });
      } else {
        // Validate the answered question
        const question = await db.select({
          correctAnswerIndex: quizQuestions.correctAnswerIndex
        }).from(quizQuestions).where(eq(quizQuestions.id, answer.questionId)).limit(1);

        if (question.length > 0) {
          const isCorrect = answer.selectedOption === question[0].correctAnswerIndex;
          if (isCorrect) {
            score++;
          }

          processedAnswers.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            isCorrect
          });
        } else {
          // Question not found in database - mark as incorrect
          processedAnswers.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            isCorrect: false
          });
        }
      }
    }

    console.log('Processed answers:', processedAnswers); // Debug log
    console.log('Calculated score:', score); // Debug log
    console.log('Total questions:', totalQuestions); // Debug log
    console.log('Test mode:', testMode); // Debug log

    // Insert quiz result only (no individual answers stored)
    const [result] = await db.insert(quizResults).values({
      userId: userIdString,
      score,
      totalQuestions,
      date: new Date()
    }).returning();

    // Encrypt the response
    const encryptedResponse = SimpleEncryption.encrypt(JSON.stringify({
      success: true,
      score,
      totalQuestions,
      message: 'Quiz results saved successfully'
    }));

    return NextResponse.json({
      data: encryptedResponse
    });
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    return NextResponse.json({ error: 'Failed to submit quiz answers' }, { status: 500 });
  }
}