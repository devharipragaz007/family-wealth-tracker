interface StockHolding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  investment: number;
  profitLoss: number;
  profitLossPercentage: number;
  lastUpdated: Date;
}

export async function fetchStockHoldings(): Promise<StockHolding[]> {
  try {
    const response = await fetch('/api/holdings/stocks');
    if (!response.ok) {
      throw new Error('Failed to fetch stock holdings');
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock holdings:', error);
    throw error;
  }
}

export async function fetchMutualFundHoldings() {
  // Similar implementation for mutual funds
  // You can create a separate endpoint for mutual funds
  return [];
}

export async function fetchCryptoHoldings() {
  // Similar implementation for crypto
  // You can create a separate endpoint for crypto
  return [];
}

// Add more functions for other asset types as needed
