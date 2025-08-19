'use client';

import { useState, useEffect } from 'react';
import { fetchStockHoldings, fetchMutualFundHoldings, fetchCryptoHoldings } from '@/lib/services/holdings';

export interface Holding {
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

export function useHoldings(assetType: 'stocks' | 'mutual-funds' | 'crypto') {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data: Holding[] = [];
        
        switch (assetType) {
          case 'stocks':
            data = await fetchStockHoldings();
            break;
          case 'mutual-funds':
            data = await fetchMutualFundHoldings();
            break;
          case 'crypto':
            data = await fetchCryptoHoldings();
            break;
          default:
            data = [];
        }
        
        setHoldings(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch holdings'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assetType]);

  return { holdings, loading, error };
}
