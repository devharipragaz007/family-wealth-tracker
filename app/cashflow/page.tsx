import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CashflowPage() {
  const transactions = [
    { id: 1, description: "Salary", amount: 250000, type: 'income', date: '2025-08-15', category: 'Salary' },
    { id: 2, description: "Grocery Store", amount: -4500, type: 'expense', date: '2025-08-14', category: 'Food' },
    { id: 3, description: "Electric Bill", amount: -3500, type: 'expense', date: '2025-08-10', category: 'Utilities' },
    { id: 4, description: "Freelance Work", amount: 50000, type: 'income', date: '2025-08-05', category: 'Other Income' },
    { id: 5, description: "Dining Out", amount: -2500, type: 'expense', date: '2025-08-03', category: 'Food' },
  ]

  const income = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0)
  const expenses = transactions.reduce((sum, t) => t.type === 'expense' ? sum + Math.abs(t.amount) : sum, 0)
  const savings = income - expenses

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cashflow</h2>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <span className="h-4 w-4 text-green-500">↑</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{income.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <span className="h-4 w-4 text-red-500">↓</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{expenses.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings</CardTitle>
                <span className="h-4 w-4 text-green-500">↑</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{savings.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">{(savings/income*100).toFixed(1)}% of income</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Spending chart will be displayed here
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`text-right ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        <p className="font-medium">
                          {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
