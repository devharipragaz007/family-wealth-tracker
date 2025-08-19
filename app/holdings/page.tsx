'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHoldings, type Holding } from "@/hooks/useHoldings"
import { formatCurrency } from "@/lib/utils"
import { formatPercentage } from "@/lib/financial-utils"
import { Skeleton } from "@/components/ui/skeleton"

// Component to display a single holding row
function HoldingRow({ holding }: { holding: Holding }) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="space-y-1">
        <p className="font-medium">{holding.name}</p>
        <p className="text-sm text-muted-foreground">{holding.symbol}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{formatCurrency(holding.currentValue)}</p>
        <p className={`text-sm ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(holding.profitLoss)} ({formatPercentage(holding.profitLossPercentage)})
        </p>
      </div>
    </div>
  )
}

// Component to display loading state
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 border-b">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-4 w-24 ml-auto" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Component to display holdings for a specific asset type
function HoldingsTab({ assetType }: { assetType: 'stocks' | 'mutual-funds' | 'crypto' }) {
  const { holdings, loading, error } = useHoldings(assetType);

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Failed to load {assetType}. {error.message}
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (holdings.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 p-8 text-center text-muted-foreground">
        No {assetType} holdings found. Add your first {assetType.split('-').join(' ')} to get started.
      </div>
    );
  }

  return (
    <Card>
      <div className="divide-y">
        {holdings.map((holding) => (
          <HoldingRow key={holding.id} holding={holding} />
        ))}
      </div>
    </Card>
  );
}

export default function HoldingsPage() {
  const { holdings: stocks } = useHoldings('stocks');
  const { holdings: mutualFunds } = useHoldings('mutual-funds');
  const { holdings: crypto } = useHoldings('crypto');

  // Calculate total values
  const totalStocks = stocks.reduce((sum, h) => sum + h.currentValue, 0);
  const totalMFs = mutualFunds.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCrypto = crypto.reduce((sum, h) => sum + h.currentValue, 0);
  const totalValue = totalStocks + totalMFs + totalCrypto;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Holdings</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <span className="h-4 w-4 text-muted-foreground">₹</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stocks</CardTitle>
                <span className="h-4 w-4 text-muted-foreground">📈</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalStocks)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalValue > 0 ? Math.round((totalStocks / totalValue) * 100) : 0}% of portfolio
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mutual Funds</CardTitle>
                <span className="h-4 w-4 text-muted-foreground">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalMFs)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalValue > 0 ? Math.round((totalMFs / totalValue) * 100) : 0}% of portfolio
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Crypto</CardTitle>
                <span className="h-4 w-4 text-muted-foreground">💎</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalCrypto)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalValue > 0 ? Math.round((totalCrypto / totalValue) * 100) : 0}% of portfolio
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                  <p className="text-sm text-muted-foreground">Asset allocation chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Stock Purchase</p>
                        <p className="text-sm text-muted-foreground">Today</p>
                      </div>
                      <p className="font-medium">+₹12,345</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Stocks Tab */}
        <TabsContent value="stocks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Stock Holdings</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {stocks.length} {stocks.length === 1 ? 'holding' : 'holdings'}
              </p>
            </div>
          </div>
          <HoldingsTab assetType="stocks" />
        </TabsContent>
        
        {/* Mutual Funds Tab */}
        <TabsContent value="mutual-funds" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Mutual Fund Holdings</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {mutualFunds.length} {mutualFunds.length === 1 ? 'fund' : 'funds'}
              </p>
            </div>
          </div>
          <HoldingsTab assetType="mutual-funds" />
        </TabsContent>
        
        {/* Crypto Tab */}
        <TabsContent value="crypto" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Cryptocurrency Holdings</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {crypto.length} {crypto.length === 1 ? 'asset' : 'assets'}
              </p>
            </div>
          </div>
          <HoldingsTab assetType="crypto" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
