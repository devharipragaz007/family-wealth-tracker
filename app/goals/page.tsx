import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function GoalsPage() {
  const goals = [
    {
      id: 1,
      name: "Retirement Fund",
      target: 5000000,
      current: 1250000,
      deadline: "2045",
      progress: 25,
    },
    {
      id: 2,
      name: "Child's Education",
      target: 2500000,
      current: 750000,
      deadline: "2035",
      progress: 30,
    },
    {
      id: 3,
      name: "Dream Home",
      target: 10000000,
      current: 2500000,
      deadline: "2030",
      progress: 25,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Goals</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{goal.name}</CardTitle>
              <CardDescription>Target: ₹{goal.target.toLocaleString('en-IN')} by {goal.deadline}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>₹{goal.current.toLocaleString('en-IN')} saved</span>
                  <span className="text-muted-foreground">
                    {goal.progress}% of target
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  ₹{(goal.target - goal.current).toLocaleString('en-IN')} more to go
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="flex items-center justify-center border-2 border-dashed bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-1 p-6 text-center">
            <div className="text-2xl">+</div>
            <div className="text-sm text-muted-foreground">Add New Goal</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Goal progress chart will be displayed here
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Child's School Admission", "Car Down Payment", "Vacation Fund"].map((milestone, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{milestone}</p>
                    <p className="text-sm text-muted-foreground">Due in {i + 2} months</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{((i + 1) * 50000).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
