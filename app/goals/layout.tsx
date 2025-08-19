import DashboardLayout from "../dashboard/layout"

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
