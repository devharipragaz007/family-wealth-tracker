// app/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Target, Plus, Upload, Settings, Eye } from 'lucide-react';

export default function Home() {
  const netWorth = 125000;
  const invested = 75000;
  const returns = 8500;
  const emergencyFund = 25000;
  const emergencyFundTarget = 30000;
  
  const returnsPercentage = ((returns / invested) * 100).toFixed(1);
  const emergencyFundProgress = (emergencyFund / emergencyFundTarget) * 100;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Wealth Dashboard</h1>
          <p className="text-gray-600 mt-2">Your comprehensive view of family finances and investments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netWorth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total assets minus liabilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${invested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all investment accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${returns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{returnsPercentage}% overall return</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Fund</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${emergencyFund.toLocaleString()}</div>
            <Progress value={emergencyFundProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(emergencyFundProgress)}% of ${emergencyFundTarget.toLocaleString()} target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="flex items-center gap-2 h-auto py-4 flex-col">
              <Plus className="h-6 w-6" />
              <span>Add Investment</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto py-4 flex-col">
              <Target className="h-6 w-6" />
              <span>Set Goals</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto py-4 flex-col">
              <Eye className="h-6 w-6" />
              <span>View Holdings</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto py-4 flex-col">
              <Upload className="h-6 w-6" />
              <span>Import Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Charts - Charts will be added when recharts is properly configured */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Investment Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Charts will be implemented here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Pie charts will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
