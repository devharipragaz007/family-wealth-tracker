import DashboardLayout from "../dashboard/layout"

export default function HoldingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
