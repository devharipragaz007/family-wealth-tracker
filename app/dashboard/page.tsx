'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface DashboardData {
  summary: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    cashFlow: number;
  };
  portfolioPerformance: {
    currentValue: number;
    previousValue: number;
    changeAmount: number;
    changePercentage: number;
  };
  assetAllocation: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentTransactions: Array<{
    id: number;
    name: string;
    type: string;
    amount: number;
    date: string;
    category: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <Icons.alertCircle className="h-8 w-8 mx-auto text-red-500" />
          <p className="text-red-500">{error || 'Failed to load dashboard data'}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            <Icons.refresh className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Safely destructure after checking data exists
  const { 
    summary = { 
      netWorth: 0, 
      totalAssets: 0, 
      totalLiabilities: 0, 
      monthlyIncome: 0, 
      monthlyExpenses: 0, 
      cashFlow: 0 
    }, 
    portfolioPerformance = { 
      currentValue: 0, 
      previousValue: 0, 
      changeAmount: 0, 
      changePercentage: 0 
    },
    assetAllocation = [],
    recentTransactions = []
  } = data || {};

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icons.download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Icons.plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Net Worth Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Worth
            </CardTitle>
            <Icons.wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summary.netWorth.toLocaleString('en-IN')}
            </div>
            <p className={`text-xs ${portfolioPerformance.changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioPerformance.changePercentage >= 0 ? '↑' : '↓'} {Math.abs(portfolioPerformance.changePercentage)}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assets
            </CardTitle>
            <Icons.arrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summary.totalAssets.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Liabilities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Liabilities
            </CardTitle>
            <Icons.arrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summary.totalLiabilities.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              -2.3% from last month
            </p>
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Cash Flow
            </CardTitle>
            <Icons.cash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.cashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {summary.cashFlow >= 0 ? '+' : ''}₹{Math.abs(summary.cashFlow).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Income: ₹{summary.monthlyIncome.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 rounded-full border-4 border-muted">
                      {assetAllocation.map((item, index) => {
                        const rotation = assetAllocation
                          .slice(0, index)
                          .reduce((sum, i) => sum + (i.value / 100) * 360, 0);
                        
                        return (
                          <div
                            key={item.name}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(
                                from ${rotation}deg,
                                ${item.color} ${(item.value / 100) * 360}deg,
                                transparent 0
                              )`,
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {Math.round(assetAllocation.reduce((sum, item) => sum + item.value, 0))}%
                        </p>
                        <p className="text-sm text-muted-foreground">Allocated</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {assetAllocation.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold">
                      {portfolioPerformance.changePercentage >= 0 ? '↑' : '↓'} {Math.abs(portfolioPerformance.changePercentage)}%
                    </div>
                    <p className="text-muted-foreground">
                      {portfolioPerformance.changePercentage >= 0 ? 'Increase' : 'Decrease'} from last month
                    </p>
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="text-2xl font-bold">
                        ₹{portfolioPerformance.currentValue.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Assets Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetAllocation.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-medium">
                        ₹{Math.round((item.value / 100) * summary.totalAssets).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.value}% of portfolio</span>
                      <span>
                        {Math.round((item.value / 100) * summary.totalAssets).toLocaleString('en-IN')} / {summary.totalAssets.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'Income' ? 'bg-green-100 text-green-600' : 
                        transaction.type === 'Buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'Income' ? (
                          <Icons.arrowDown className="h-4 w-4" />
                        ) : transaction.type === 'Buy' ? (
                          <Icons.arrowUp className="h-4 w-4" />
                        ) : (
                          <Icons.refresh className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'Income' ? 'text-green-600' : 'text-foreground'
                    }`}>
                      {transaction.type === 'Income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
