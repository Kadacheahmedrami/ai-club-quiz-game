import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database'; // Assuming we'll create this
import QuizResult from '@/models/QuizResult'; // Assuming we'll create this model
import User from '@/models/User'; // Assuming we'll create this model

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get all quiz results with user information
    const results = await QuizResult.find({})
      .populate('user', 'name email createdAt') // Populate user info but exclude sensitive data
      .sort({ date: -1 }); // Sort by most recent

    // Calculate overall statistics
    const totalUsers = await User.countDocuments({});
    const totalQuizzesTaken = results.length;
    const averageScore = results.length > 0 
      ? (results.reduce((sum, result) => sum + result.score, 0) / results.length).toFixed(2)
      : 0;

    return NextResponse.json({ 
      results,
      statistics: {
        totalUsers,
        totalQuizzesTaken,
        averageScore: parseFloat(averageScore)
      }
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz results' }, { status: 500 });
  }
}