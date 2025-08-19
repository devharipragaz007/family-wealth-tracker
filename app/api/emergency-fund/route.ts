import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-utils';

// GET /api/emergency-fund - Get emergency fund status
export async function GET() {
  // Temporary implementation - will be replaced with actual database query
  const monthlyExpenses = 0;
  const currentAmount = 0;
  const targetMonths = 6;
  const targetAmount = monthlyExpenses * targetMonths;
  const progress = monthlyExpenses > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
  const monthsCovered = monthlyExpenses > 0 ? Math.floor(currentAmount / monthlyExpenses) : 0;
  const monthsRemaining = Math.max(0, targetMonths - monthsCovered);

  return successResponse({
    targetMonths,
    currentAmount,
    monthlyExpenses,
    targetAmount,
    progress,
    monthsCovered,
    monthsRemaining,
    lastUpdated: new Date().toISOString(),
  });
}

// POST /api/emergency-fund - Update emergency fund
export async function POST(req: NextRequest) {
  try {
    // Temporary implementation - will be replaced with actual database update
    const { targetMonths = 6, currentAmount = 0, monthlyExpenses = 0 } = await req.json();
    
    // Calculate derived values
    const targetAmount = monthlyExpenses * targetMonths;
    const progress = monthlyExpenses > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
    const monthsCovered = monthlyExpenses > 0 ? Math.floor(currentAmount / monthlyExpenses) : 0;
    const monthsRemaining = Math.max(0, targetMonths - monthsCovered);

    return successResponse({
      id: 'temp-id',
      workspaceId: 'temp-workspace-id',
      targetMonths,
      currentAmount,
      monthlyExpenses,
      targetAmount,
      progress,
      monthsCovered,
      monthsRemaining,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in emergency fund update:', error);
    return errorResponse(500, 'Failed to update emergency fund');
  }
}
