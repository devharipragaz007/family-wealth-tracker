import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Update the user's email verification status
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({ 
      success: true,
      emailVerified: updatedUser.emailVerified 
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
