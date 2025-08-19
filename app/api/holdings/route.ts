import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  unauthorizedResponse 
} from '@/lib/api-utils';

// GET /api/holdings - Get all holdings
// POST /api/holdings - Create a new holding
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to view holdings');
    }

    // In a real app, you'd get the user's workspace ID from the session
    const holdings = await prisma.holding.findMany({
      where: {},
      include: {
        transactions: true,
      },
    });

    return successResponse(holdings);
  } catch (error) {
    return errorResponse(500, 'Failed to fetch holdings', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to create a holding');
    }

    const data = await req.json();
    
    // Validate input data here
    if (!data.type || !data.name || !data.quantity || !data.averagePrice) {
      return errorResponse(400, 'Missing required fields');
    }

    // In a real app, you'd get the workspace ID from the session
    const holding = await prisma.holding.create({
      data: {
        name: data.name,
        type: data.type,
        quantity: parseFloat(data.quantity),
        averagePrice: parseFloat(data.averagePrice),
        // Add other fields as needed
      },
    });

    return successResponse(holding, 'Holding created successfully');
  } catch (error) {
    return errorResponse(500, 'Failed to create holding', error);
  }
}
