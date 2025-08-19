import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Reports</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="net-worth">Net Worth</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                <span className="h-4 w-4 text-muted-foreground">₹</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1,23,45,678</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <span className="h-4 w-4 text-green-500">↑</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹3,25,000</div>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <span className="h-4 w-4 text-red-500">↓</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1,87,500</div>
                <p className="text-xs text-muted-foreground">-3.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <span className="h-4 w-4 text-green-500">↑</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.3%</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Net Worth Trend</CardTitle>
                <CardDescription>Last 12 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Net worth trend chart will be displayed here
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Asset allocation chart will be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="net-worth">
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Report</CardTitle>
              <CardDescription>Track your net worth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                Net worth report with detailed breakdown will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income Report</CardTitle>
              <CardDescription>Track your income sources and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                Income report with detailed breakdown will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Report</CardTitle>
              <CardDescription>Analyze your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                Expense report with detailed breakdown will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>Investment Report</CardTitle>
              <CardDescription>Track your investment performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                Investment report with detailed breakdown will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
