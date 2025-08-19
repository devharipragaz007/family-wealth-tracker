#!/bin/bash

# List of protected routes
routes=("activity" "cashflow" "emergency-fund" "fx" "goals" "holdings" "reports")

# Create layout files for each route
for route in "${routes[@]}"; do
  # Create the directory if it doesn't exist
  mkdir -p "app/$route"
  
  # Create the layout file
  cat > "app/$route/layout.tsx" << 'EOL'
'use client'

import { ThemeProvider } from "@/components/theme-provider"
import ProtectedLayout from "@/components/protected-layout"

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProtectedLayout>{children}</ProtectedLayout>
    </ThemeProvider>
  )
}
EOL

echo "Created layout for $route"
done

echo "All protected layouts have been created!"
