import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params promise to access userId
    const awaitedParams = await params;

    // Authenticate user using NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify that the userId in the request matches the authenticated user's ID
    if (session.user?.id !== awaitedParams.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid user ID' }, { status: 401 });
    }

    // Fetch user information from the database
    try {
      const user = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image
      })
      .from(users)
      .where(eq(users.id, awaitedParams.userId))
      .limit(1);

      if (user.length > 0) {
        return NextResponse.json({
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          image: user[0].image
        });
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 });
  }
}