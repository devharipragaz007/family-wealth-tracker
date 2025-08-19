import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to view stock holdings');
    }

    // Get all stock holdings for the user's workspace
    // Note: In a production app, you'd want to filter by workspace ID from the session
    const stocks = await prisma.stockHolding.findMany({
      // Add any necessary where clauses here
    });

    // Format the response to match the expected StockHolding interface
    const formattedStocks = stocks.map((stock: {
      id: string;
      name: string;
      symbol: string | null;
      qty: number;
      avgBuyPrice: number | string;
      cmp: number | string;
      currentValue: number | string;
      invested: number | string;
      pnl: number | string;
      pnlPct: number;
      updatedAt: Date;
    }) => ({
      id: stock.id,
      name: stock.name,
      symbol: stock.symbol || '',
      quantity: stock.qty,
      averagePrice: Number(stock.avgBuyPrice),
      currentPrice: Number(stock.cmp),
      currentValue: Number(stock.currentValue),
      investment: Number(stock.invested),
      profitLoss: Number(stock.pnl),
      profitLossPercentage: stock.pnlPct,
      lastUpdated: stock.updatedAt,
    }));

    interface StockWithTransactions {
      id: string;
      name: string;
      symbol: string;
      quantity: number;
      averagePrice: number;
      updatedAt: Date;
      transactions: Array<{ 
        price: number;
        date?: Date;
      }>;
    }

    const stocksWithCalculations = formattedStocks.map((stock: StockWithTransactions) => {
      const latestTransaction = stock.transactions[0];
      const currentValue = latestTransaction?.price * stock.quantity;
      const investment = stock.averagePrice * stock.quantity;
      const profitLoss = currentValue - investment;
      const profitLossPercentage = (profitLoss / investment) * 100;

      return {
        id: stock.id,
        name: stock.name,
        symbol: stock.symbol,
        quantity: stock.quantity,
        averagePrice: stock.averagePrice,
        currentPrice: latestTransaction?.price || stock.averagePrice,
        currentValue,
        investment,
        profitLoss,
        profitLossPercentage,
        lastUpdated: latestTransaction?.date || stock.updatedAt,
      };
    });

    return successResponse(stocksWithCalculations);
  } catch (error) {
    return errorResponse(500, 'Failed to fetch stock holdings', error);
  }
}
