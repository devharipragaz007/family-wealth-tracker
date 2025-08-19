import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  unauthorizedResponse 
} from '@/lib/api-utils';

// GET /api/transactions - Get all transactions with filtering
// POST /api/transactions - Create a new transaction
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to view transactions');
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        account: true,
        category: true,
      },
    });

    return successResponse(transactions);
  } catch (error) {
    return errorResponse(500, 'Failed to fetch transactions', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to create a transaction');
    }

    const data = await req.json();
    
    // Validate input data
    if (!data.amount || !data.date || !data.type || !data.accountId) {
      return errorResponse(400, 'Missing required fields');
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(data.amount),
        description: data.description || '',
        type: data.type,
        date: new Date(data.date),
        accountId: data.accountId,
        categoryId: data.categoryId,
        // Add other fields as needed
      },
    });

    // Update account balance if needed
    if (data.updateBalance) {
      const account = await prisma.account.findUnique({
        where: { id: data.accountId },
      });

      if (account) {
        const newBalance = data.type === 'INCOME' 
          ? account.balance + parseFloat(data.amount)
          : account.balance - parseFloat(data.amount);

        await prisma.account.update({
          where: { id: data.accountId },
          data: { balance: newBalance },
        });
      }
    }

    return successResponse(transaction, 'Transaction created successfully');
  } catch (error) {
    return errorResponse(500, 'Failed to create transaction', error);
  }
}
