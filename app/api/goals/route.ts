import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  unauthorizedResponse 
} from '@/lib/api-utils';

// GET /api/goals - Get all goals
// POST /api/goals - Create a new goal
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to view goals');
    }

    const goals = await prisma.financialGoal.findMany({
      where: {},
      include: {
        transactions: true,
      },
    });

    return successResponse(goals);
  } catch (error) {
    return errorResponse(500, 'Failed to fetch goals', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to create a goal');
    }

    const data = await req.json();
    
    // Validate input data
    if (!data.name || !data.targetAmount || !data.targetDate) {
      return errorResponse(400, 'Missing required fields');
    }

    const goal = await prisma.financialGoal.create({
      data: {
        name: data.name,
        description: data.description || '',
        targetAmount: parseFloat(data.targetAmount),
        currentAmount: parseFloat(data.currentAmount) || 0,
        targetDate: new Date(data.targetDate),
        status: data.status || 'IN_PROGRESS',
        // Add other fields as needed
      },
    });

    return successResponse(goal, 'Goal created successfully');
  } catch (error) {
    return errorResponse(500, 'Failed to create goal', error);
  }
}
