import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Activity = {
  id: string
  type: 'transaction' | 'investment' | 'goal' | 'account' | 'other'
  title: string
  description: string
  amount?: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'Salary Credit',
    description: 'Monthly salary for August 2025',
    amount: 250000,
    date: '2025-08-01T10:00:00Z',
    status: 'completed'
  },
  {
    id: '2',
    type: 'investment',
    title: 'Mutual Fund Purchase',
    description: 'Axis Bluechip Fund - Growth',
    amount: -50000,
    date: '2025-08-02T14:30:00Z',
    status: 'completed'
  },
  {
    id: '3',
    type: 'transaction',
    title: 'Rent Payment',
    description: 'Monthly rent for August 2025',
    amount: -45000,
    date: '2025-08-03T09:15:00Z',
    status: 'completed'
  },
  {
    id: '4',
    type: 'goal',
    title: 'Emergency Fund Goal',
    description: 'Updated target amount to ₹10,00,000',
    date: '2025-08-04T16:45:00Z',
    status: 'completed'
  },
  {
    id: '5',
    type: 'investment',
    title: 'Stock Purchase',
    description: 'Bought 10 shares of TCS',
    amount: -35250,
    date: '2025-08-05T11:20:00Z',
    status: 'completed'
  },
  {
    id: '6',
    type: 'transaction',
    title: 'Credit Card Payment',
    description: 'HDFC Credit Card payment',
    amount: -12500,
    date: '2025-08-06T08:30:00Z',
    status: 'pending'
  },
  {
    id: '7',
    type: 'account',
    title: 'New Account',
    description: 'Added new savings account (HDFC XXXX-7890)',
    date: '2025-08-07T13:10:00Z',
    status: 'completed'
  },
  {
    id: '8',
    type: 'transaction',
    title: 'Electricity Bill',
    description: 'August 2025 bill payment',
    amount: -3500,
    date: '2025-08-08T10:45:00Z',
    status: 'completed'
  },
  {
    id: '9',
    type: 'investment',
    title: 'SIP Investment',
    description: 'Mirae Asset Large Cap Fund',
    amount: -10000,
    date: '2025-08-09T12:00:00Z',
    status: 'pending'
  },
  {
    id: '10',
    type: 'transaction',
    title: 'Grocery Shopping',
    description: 'Big Bazaar',
    amount: -4500,
    date: '2025-08-10T18:30:00Z',
    status: 'completed'
  }
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default'
    case 'pending':
      return 'outline'
    case 'failed':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'transaction':
      return '₹'
    case 'investment':
      return '📈'
    case 'goal':
      return '🎯'
    case 'account':
      return '🏦'
    default:
      return 'ℹ️'
  }
}

export default function ActivityPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>All your financial activities in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                      <span className="text-lg">{getTypeIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{activity.title}</h3>
                        {activity.amount && (
                          <span className={`font-mono ${activity.amount > 0 ? 'text-green-600' : 'text-foreground'}`}>
                            {activity.amount > 0 ? '+' : ''}{activity.amount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">Load More</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                Transaction history will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>Investment Activity</CardTitle>
              <CardDescription>All your investment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                Investment activity will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Goal Updates</CardTitle>
              <CardDescription>All updates related to your financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                Goal updates will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
