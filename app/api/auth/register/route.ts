import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database'; // Assuming we'll create this
import User from '@/models/User'; // Assuming we'll create this model
import bcrypt from 'bcryptjs'; // We'll need to install this

interface UserRegistration {
  email: string;
  password: string;
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UserRegistration = await request.json();
    const { email, password, name } = body;

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name
    });

    await newUser.save();

    // Don't return the password hash
    const userResponse = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({ 
      success: true, 
      user: userResponse,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}