import DashboardLayout from "../dashboard/layout"

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
