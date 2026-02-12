import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database'; // Assuming we'll create this
import User from '@/models/User'; // Assuming we'll create this model
import bcrypt from 'bcryptjs'; // We'll need to install this
import jwt from 'jsonwebtoken'; // We'll need to install this

interface UserLogin {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UserLogin = await request.json();
    const { email, password } = body;

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    // Don't return the password hash
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };

    return NextResponse.json({ 
      success: true, 
      user: userResponse,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ error: 'Failed to login user' }, { status: 500 });
  }
}