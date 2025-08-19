"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Icons.dashboard,
  },
  {
    title: "Holdings",
    href: "/holdings",
    icon: Icons.holdings,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: Icons.goals,
  },
  {
    title: "Cashflow",
    href: "/cashflow",
    icon: Icons.cashflow,
  },
  {
    title: "Emergency Fund",
    href: "/emergency-fund",
    icon: Icons.emergencyFund,
  },
  {
    title: "FX",
    href: "/fx",
    icon: Icons.currency,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: Icons.reports,
  },
  {
    title: "Activity",
    href: "/activity",
    icon: Icons.activity,
  },
]

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full flex-col border-r bg-background", className)}>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold">WealthTracker</span>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <div className="px-3">
          {sidebarNavItems.map((item) => (
            <div key={item.href} className="mb-2">
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="mb-4">
          <div className="text-sm font-medium">Net Worth</div>
          <div className="text-2xl font-bold">₹1,23,45,678</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Icons.trendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span>12.5% this month</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Icons.settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
