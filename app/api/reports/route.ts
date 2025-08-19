import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} from '@/lib/api-utils';

type ReportType = 'net-worth' | 'income-expense' | 'asset-allocation' | 'overview';

interface DateFilter {
  gte?: Date;
  lte?: Date;
}

interface AllocationData {
  type: string;
  value: number;
  percentage: number;
}

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface ReportParams {
  type: ReportType;
  dateRange: DateRange;
}

// GET /api/reports - Generate various financial reports
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to view reports');
    }

    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') as ReportType) || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // In a real app, you'd get the user's workspace ID from the session
    // and filter data accordingly
    const userId = session.user.email; // Using email as userId for now

    // Date range for reports
    const dateFilter: DateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    switch (type) {
      case 'net-worth': {
        try {
          const [assets, liabilities] = await Promise.all([
            prisma.holding.aggregate({
              _sum: { currentValue: true },
              where: { userId },
            }),
            prisma.loan.aggregate({
              _sum: { outstandingAmount: true },
              where: { userId },
            }),
          ]);

          const totalAssets = assets._sum.currentValue ?? 0;
          const totalLiabilities = liabilities._sum.outstandingAmount ?? 0;
          const netWorth = totalAssets - totalLiabilities;

          return successResponse({
            type: 'net-worth',
            dateRange: { startDate, endDate },
            data: {
              totalAssets,
              totalLiabilities,
              netWorth,
            },
          });
        } catch (error) {
          console.error('Net worth report error:', error);
          return errorResponse(500, 'Failed to generate net worth report');
        }
      }

      case 'income-expense': {
        try {
          const transactions = await prisma.transaction.groupBy({
            by: ['type'],
            _sum: { amount: true },
            where: {
              userId,
              date: dateFilter,
              type: { in: ['INCOME', 'EXPENSE'] },
            },
          });

          type TransactionSum = {
            type: string;
            _sum: {
              amount: number | null;
            };
          };
          
          const typedTransactions = transactions as TransactionSum[];
          const income = Number(typedTransactions.find(t => t.type === 'INCOME')?._sum.amount ?? 0);
          const expenses = Math.abs(Number(typedTransactions.find(t => t.type === 'EXPENSE')?._sum.amount ?? 0));
          const savings = income - expenses;

          return successResponse({
            type: 'income-expense',
            dateRange: { startDate, endDate },
            data: {
              income,
              expenses,
              savings,
              savingsRate: income > 0 ? (savings / income) * 100 : 0,
            },
          });
        } catch (error) {
          console.error('Income/Expense report error:', error);
          return errorResponse(500, 'Failed to generate income/expense report');
        }
      }

      case 'asset-allocation': {
        try {
          const assetAllocation = await prisma.holding.groupBy({
            by: ['type'],
            _sum: { currentValue: true },
            where: { userId },
          });

          type HoldingWithSum = {
            type: string;
            _sum: {
              currentValue: number | null;
            };
          };
          
          const typedAssetAllocation = assetAllocation as (HoldingWithSum)[];
          const totalValue = typedAssetAllocation.reduce(
            (sum, asset) => sum + (asset._sum.currentValue ?? 0), 
            0
          );

          const allocations: AllocationData[] = typedAssetAllocation.map(asset => ({
            type: asset.type,
            value: asset._sum.currentValue ?? 0,
            percentage: totalValue > 0 ? ((asset._sum.currentValue ?? 0) / totalValue) * 100 : 0,
          }));

          return successResponse({
            type: 'asset-allocation',
            dateRange: { startDate, endDate },
            data: {
              totalValue,
              allocations,
            },
          });
        } catch (error) {
          console.error('Asset allocation report error:', error);
          return errorResponse(500, 'Failed to generate asset allocation report');
        }
      }

      case 'overview':
      default: {
        // Return a basic overview report
        return successResponse({
          type: 'overview',
          dateRange: { startDate, endDate },
          data: {
            message: 'Overview report data will be implemented here',
          },
        });
      }
    }
  } catch (error) {
    return errorResponse(500, 'Failed to generate report', error);
  }
}
