import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FXPage() {
  const exchangeRates = [
    { currency: 'USD', name: 'US Dollar', rate: 83.25, change: 0.12 },
    { currency: 'EUR', name: 'Euro', rate: 90.45, change: -0.25 },
    { currency: 'GBP', name: 'British Pound', rate: 105.75, change: 0.08 },
    { currency: 'JPY', name: 'Japanese Yen', rate: 0.58, change: -0.03 },
    { currency: 'AUD', name: 'Australian Dollar', rate: 55.20, change: 0.15 },
    { currency: 'CAD', name: 'Canadian Dollar', rate: 61.80, change: -0.10 },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Currency Exchange</h2>
      </div>

      <Tabs defaultValue="converter" className="space-y-4">
        <TabsList>
          <TabsTrigger value="converter">Currency Converter</TabsTrigger>
          <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
        </TabsList>

        <TabsContent value="converter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Converter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Amount</label>
                    <div className="flex">
                      <Select defaultValue="INR">
                        <SelectTrigger className="w-[100px] rounded-r-none border-r-0">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="rounded-l-none"
                        defaultValue="1000"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <button className="rounded-full bg-muted p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M3 16h4l2-6 4 12h4l3-16h4" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Converted Amount</label>
                    <div className="flex">
                      <Select defaultValue="USD">
                        <SelectTrigger className="w-[100px] rounded-r-none border-r-0">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="text"
                        readOnly
                        value="12.01"
                        className="rounded-l-none font-mono text-lg font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                      Convert
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-[250px] w-full rounded-lg border p-4">
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      Exchange rate chart will be displayed here
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Exchange Rates</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Base: INR (Indian Rupee)
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Currency</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Rate</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Change (24h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exchangeRates.map((rate) => (
                      <tr key={rate.currency} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{rate.currency}</div>
                          <div className="text-sm text-muted-foreground">{rate.name}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono">1 {rate.currency} = {rate.rate} INR</td>
                        <td className={`px-4 py-3 text-right ${rate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Rates are updated every 5 minutes. Last updated: {new Date().toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historical Exchange Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Historical exchange rate chart will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
