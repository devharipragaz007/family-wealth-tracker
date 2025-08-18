'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  Target, 
  Plus, 
  Upload, 
  Settings, 
  Eye,
  CreditCard,
  Home,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function DashboardHome() {
  // Sample data - replace with actual data from your backend
  const kpiData = {
    netWorth: 235000,
    monthlyIncome: 12000,
    monthlyExpenses: 8500,
    invested: 125000,
    returns: 15750,
    emergencyFund: 35000,
    emergencyFundTarget: 40000,
    debt: 45000,
    savingsRate: 29.2
  };

  const returnsPercentage = ((kpiData.returns / kpiData.invested) * 100).toFixed(1);
  const emergencyFundProgress = (kpiData.emergencyFund / kpiData.emergencyFundTarget) * 100;

  const recentTransactions = [
    { id: 1, description: "Salary Deposit", amount: 12000, type: "income", date: "2025-08-15" },
    { id: 2, description: "Grocery Shopping", amount: -450, type: "expense", date: "2025-08-14" },
    { id: 3, description: "Investment Portfolio", amount: 2500, type: "investment", date: "2025-08-13" },
    { id: 4, description: "Utility Bills", amount: -320, type: "expense", date: "2025-08-12" }
  ];

  const upcomingGoals = [
    { id: 1, title: "House Down Payment", target: 50000, current: 32000, deadline: "Dec 2025" },
    { id: 2, title: "Vacation Fund", target: 8000, current: 3200, deadline: "Jun 2026" },
    { id: 3, title: "Kids Education", target: 75000, current: 15000, deadline: "Aug 2030" }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Family Wealth Dashboard</h1>
            <p className="text-gray-600 mt-2">Your comprehensive view of family finances and investments</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Last updated: 2 hours ago
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Reports
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Net Worth</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${kpiData.netWorth.toLocaleString()}</div>
              <div className="flex items-center text-xs text-blue-100 mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Investment Returns</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${kpiData.returns.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                {returnsPercentage}% return rate
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${(kpiData.monthlyIncome - kpiData.monthlyExpenses).toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                {kpiData.savingsRate}% savings rate
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Debt</CardTitle>
              <CreditCard className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${kpiData.debt.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-2">
                <TrendingDown className="h-3 w-3 mr-1" />
                -8.2% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary KPIs and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="text-xl font-semibold text-green-600">${kpiData.monthlyIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Expenses</p>
                  <p className="text-xl font-semibold text-red-600">${kpiData.monthlyExpenses.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Emergency Fund Progress</span>
                  <span className="text-sm font-medium">${kpiData.emergencyFund.toLocaleString()} / ${kpiData.emergencyFundTarget.toLocaleString()}</span>
                </div>
                <Progress value={emergencyFundProgress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{emergencyFundProgress.toFixed(1)}% complete</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <PieChart className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Family Goals
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Budget Planner
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{goal.title}</span>
                      <Badge variant="secondary">{goal.deadline}</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                      <span>{((goal.current / goal.target) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Goal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Asset Allocation Quick View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Allocation Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">45%</div>
                <div className="text-sm text-blue-800">Stocks</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">25%</div>
                <div className="text-sm text-green-800">Bonds</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">20%</div>
                <div className="text-sm text-yellow-800">Cash & Savings</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">10%</div>
                <div className="text-sm text-purple-800">Real Estate</div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Detailed Allocation
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
