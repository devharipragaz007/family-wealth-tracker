import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  unauthorizedResponse 
} from '@/lib/api-utils';

// GET /api/fx/rates - Get current exchange rates
// GET /api/fx/convert - Convert between currencies
// GET /api/fx/history - Get historical exchange rates

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return unauthorizedResponse('You must be logged in to access FX data');
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const amount = searchParams.get('amount');
    const date = searchParams.get('date');

    // In a real app, you would fetch this from a currency exchange API
    // This is a simplified example with hardcoded rates
    const rates: Record<string, number> = {
      USD: 83.25,
      EUR: 90.45,
      GBP: 105.75,
      JPY: 0.58,
      AUD: 55.20,
      CAD: 61.80,
      // Add more currencies as needed
    };

    // Default base currency is INR
    rates['INR'] = 1;

    // Handle /api/fx/rates
    if (searchParams.has('base')) {
      const base = searchParams.get('base')?.toUpperCase() || 'INR';
      const baseRate = rates[base] || 1;
      
      // Convert all rates to the requested base currency
      const convertedRates: Record<string, number> = {};
      for (const [currency, rate] of Object.entries(rates)) {
        convertedRates[currency] = rate / baseRate;
      }
      
      return successResponse({
        base,
        rates: convertedRates,
        date: new Date().toISOString().split('T')[0],
      });
    }

    // Handle /api/fx/convert
    if (from && to && amount) {
      const fromRate = rates[from.toUpperCase()] || 1;
      const toRate = rates[to.toUpperCase()] || 1;
      const amountValue = parseFloat(amount);
      
      if (isNaN(amountValue)) {
        return errorResponse(400, 'Invalid amount');
      }
      
      const result = (amountValue * fromRate) / toRate;
      
      return successResponse({
        from,
        to,
        amount: amountValue,
        convertedAmount: parseFloat(result.toFixed(6)),
        rate: parseFloat((toRate / fromRate).toFixed(6)),
        date: new Date().toISOString(),
      });
    }

    // Handle /api/fx/history
    if (date) {
      // In a real app, you would fetch historical data from an API
      return successResponse({
        date,
        base: 'INR',
        rates: {
          USD: 82.50, // Example historical rate
          EUR: 89.80,
          GBP: 105.20,
        },
      });
    }

    // Default response with all rates in INR
    return successResponse({
      base: 'INR',
      rates,
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    return errorResponse(500, 'Failed to fetch FX data', error);
  }
}
