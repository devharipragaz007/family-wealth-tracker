import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function EmergencyFundPage() {
  const targetMonths = 6
  const monthlyExpenses = 75000
  const currentFund = 225000
  const targetFund = monthlyExpenses * targetMonths
  const progress = Math.min((currentFund / targetFund) * 100, 100)
  const monthsCovered = Math.floor(currentFund / monthlyExpenses)
  const monthsRemaining = Math.max(0, targetMonths - monthsCovered)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Emergency Fund</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fund Status</CardTitle>
            <CardDescription>
              Your emergency fund should cover {targetMonths} months of expenses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Fund</span>
                <span className="font-medium">₹{currentFund.toLocaleString('en-IN')}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {progress.toFixed(1)}% of target
                </span>
                <span className="text-muted-foreground">
                  ₹{targetFund.toLocaleString('en-IN')} target
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                <p className="text-xl font-bold">₹{monthlyExpenses.toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Months Covered</p>
                <p className="text-xl font-bold">{monthsCovered} / {targetMonths}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add to Fund</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fund Projection</CardTitle>
            <CardDescription>
              Projected growth of your emergency fund.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Projection chart will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Common actions for your emergency fund</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              View Transaction History
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Set Up Auto-Save
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Update Monthly Expenses
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fund Recommendations</CardTitle>
            <CardDescription>
              Suggestions to optimize your emergency fund
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <span className="h-4 w-4">✓</span>
              </div>
              <div>
                <p className="font-medium">Consider a high-yield savings account</p>
                <p className="text-sm text-muted-foreground">
                  Your emergency fund could earn more interest while remaining liquid.
                </p>
              </div>
            </div>
            
            {monthsRemaining > 0 && (
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                  <span className="h-4 w-4">!</span>
                </div>
                <div>
                  <p className="font-medium">Keep building your fund</p>
                  <p className="text-sm text-muted-foreground">
                    You're {monthsRemaining} months away from your {targetMonths}-month goal.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
