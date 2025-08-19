import ProtectedLayout from "@/components/protected-layout"
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardLayout({
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
