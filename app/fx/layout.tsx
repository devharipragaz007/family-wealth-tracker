import DashboardLayout from "../dashboard/layout"

export default function FxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
