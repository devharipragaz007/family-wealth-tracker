import { NextResponse } from 'next/server';

// Financial utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const calculateNetWorth = (assets: number, liabilities: number): number => {
  return assets - liabilities;
};

const calculateAssetAllocation = (portfolioValue: number, totalAssets: number): number => {
  return (portfolioValue / totalAssets) * 100;
};

const calculateMonthlyGrowth = (values: number[]): number => {
  if (values.length < 2) return 0;
  const currentMonth = values[values.length - 1];
  const previousMonth = values[values.length - 2];
  return calculatePercentageChange(currentMonth, previousMonth);
};

// Mock dashboard data
const mockDashboardData = {
  user: {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
  },
  summary: {
    totalAssets: 850000,
    totalLiabilities: 320000,
    netWorth: 530000,
    monthlyIncome: 12000,
    monthlyExpenses: 8500,
    cashFlow: 3500,
  },
  portfolioPerformance: {
    currentValue: 650000,
    previousValue: 620000,
    changeAmount: 30000,
    changePercentage: 4.84,
    ytdReturn: 12.5,
  },
  assetAllocation: [
    { category: 'Stocks', value: 390000, percentage: 46 },
    { category: 'Real Estate', value: 300000, percentage: 35 },
    { category: 'Bonds', value: 85000, percentage: 10 },
    { category: 'Cash', value: 51000, percentage: 6 },
    { category: 'Crypto', value: 24000, percentage: 3 },
  ],
  monthlyTrend: {
    netWorth: [480000, 495000, 510000, 520000, 530000],
    income: [11500, 12000, 11800, 12200, 12000],
    expenses: [8200, 8400, 8300, 8600, 8500],
  },
  recentTransactions: [
    {
      id: '1',
      type: 'income',
      description: 'Salary Deposit',
      amount: 12000,
      date: '2025-08-15',
      category: 'Salary',
    },
    {
      id: '2',
      type: 'expense',
      description: 'Mortgage Payment',
      amount: -2800,
      date: '2025-08-14',
      category: 'Housing',
    },
    {
      id: '3',
      type: 'investment',
      description: 'S&P 500 ETF Purchase',
      amount: 5000,
      date: '2025-08-12',
      category: 'Investment',
    },
  ],
  financialGoals: [
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 75000,
      currentAmount: 51000,
      progress: 68,
      deadline: '2025-12-31',
    },
    {
      id: '2',
      title: 'Retirement Savings',
      targetAmount: 1000000,
      currentAmount: 390000,
      progress: 39,
      deadline: '2040-01-01',
    },
    {
      id: '3',
      title: 'House Down Payment',
      targetAmount: 100000,
      currentAmount: 75000,
      progress: 75,
      deadline: '2026-06-30',
    },
  ],
  insights: [
    {
      type: 'positive',
      title: 'Strong Cash Flow',
      description: 'Your monthly cash flow of $3,500 puts you in excellent financial health.',
    },
    {
      type: 'warning',
      title: 'High Housing Costs',
      description: 'Housing expenses represent 33% of your income. Consider optimizing.',
    },
    {
      type: 'info',
      title: 'Diversification Opportunity',
      description: 'Consider increasing bond allocation to 15% for better risk management.',
    },
  ],
};

export async function GET() {
  try {
    // Apply financial calculations to mock data
    const enhancedData = {
      ...mockDashboardData,
      summary: {
        ...mockDashboardData.summary,
        netWorth: calculateNetWorth(
          mockDashboardData.summary.totalAssets,
          mockDashboardData.summary.totalLiabilities
        ),
      },
      portfolioPerformance: {
        ...mockDashboardData.portfolioPerformance,
        changePercentage: calculatePercentageChange(
          mockDashboardData.portfolioPerformance.currentValue,
          mockDashboardData.portfolioPerformance.previousValue
        ),
      },
      assetAllocation: mockDashboardData.assetAllocation.map((asset) => ({
        ...asset,
        percentage: calculateAssetAllocation(
          asset.value,
          mockDashboardData.summary.totalAssets
        ),
        formattedValue: formatCurrency(asset.value),
      })),
      monthlyGrowth: {
        netWorth: calculateMonthlyGrowth(mockDashboardData.monthlyTrend.netWorth),
        income: calculateMonthlyGrowth(mockDashboardData.monthlyTrend.income),
      },
      formattedSummary: {
        totalAssets: formatCurrency(mockDashboardData.summary.totalAssets),
        totalLiabilities: formatCurrency(mockDashboardData.summary.totalLiabilities),
        netWorth: formatCurrency(mockDashboardData.summary.netWorth),
        monthlyIncome: formatCurrency(mockDashboardData.summary.monthlyIncome),
        monthlyExpenses: formatCurrency(mockDashboardData.summary.monthlyExpenses),
        cashFlow: formatCurrency(mockDashboardData.summary.cashFlow),
      },
    };

    return NextResponse.json({
      success: true,
      data: enhancedData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle dashboard updates (e.g., goal updates, preference changes)
    if (body.type === 'updateGoal') {
      // In a real app, this would update the database
      return NextResponse.json({
        success: true,
        message: 'Goal updated successfully',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request type',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Dashboard POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
