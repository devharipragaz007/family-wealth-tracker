"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
const mobileNavItems = [
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
    title: "Add",
    href: "/add-transaction",
    icon: Icons.plusCircle,
    variant: "default" as const,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: Icons.goals,
  },
  {
    title: "More",
    icon: Icons.moreHorizontal,
  },
]

export function MobileHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const pathname = usePathname()

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="font-bold">WealthTracker</span>
      </Link>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="md:hidden" asChild>
          <Link href="/search">
            <Icons.search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <Icons.close className="h-5 w-5" />
          ) : (
            <Icons.menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      
      {showMobileMenu && (
        <div className="fixed inset-0 top-14 z-50 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="container mx-auto p-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-sm font-medium">Net Worth</p>
                  <p className="text-xl font-bold">₹1,23,45,678</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </div>
              
              <nav className="grid gap-1">
                {[
                  { title: 'Profile', href: '/profile', icon: Icons.user },
                  { title: 'Reports', href: '/reports', icon: Icons.reports },
                  { title: 'Emergency Fund', href: '/emergency-fund', icon: Icons.emergencyFund },
                  { title: 'FX', href: '/fx', icon: Icons.currency },
                  { title: 'Activity', href: '/activity', icon: Icons.activity },
                  { title: 'Help & Support', href: '/help', icon: Icons.help },
                ].map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
                
                <Button variant="ghost" className="w-full justify-start">
                  <Icons.logOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur-sm md:hidden">
        {mobileNavItems.map((item) => (
          <Button
            key={item.title}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
              "flex h-14 w-full flex-col items-center justify-center rounded-none text-xs font-medium",
              item.variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            asChild={!!item.href}
          >
            {item.href ? (
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="mt-1">{item.title}</span>
              </Link>
            ) : (
              <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <item.icon className="h-5 w-5" />
                <span className="mt-1">{item.title}</span>
              </button>
            )}
          </Button>
        ))}
      </div>
    </header>
  )
}
