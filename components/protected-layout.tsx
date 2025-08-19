'use client'

import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="flex h-screen overflow-hidden">
        <Sidebar className="hidden lg:flex" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileHeader />
          <main className="flex-1 overflow-y-auto bg-muted/30 p-4 pt-20 md:p-6 lg:p-8 lg:pt-6">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
