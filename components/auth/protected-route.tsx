"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: string
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
    } else if (status === "authenticated" && requiredRole && session?.user?.role !== requiredRole) {
      router.push("/unauthorized")
    }
  }, [status, session, router, requiredRole])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "authenticated") {
    if (requiredRole && session.user.role !== requiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }
    return <>{children}</>
  }

  return null
}
