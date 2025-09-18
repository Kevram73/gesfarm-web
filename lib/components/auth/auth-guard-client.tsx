"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Loader2 } from "lucide-react"

interface AuthGuardClientProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function AuthGuardClient({ children, redirectTo = "/" }: AuthGuardClientProps) {
  const isAuthenticated = useAuthGlobal()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  if (!isAuthenticated) {
    return (
      <LayoutSimple>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Vérification de l'authentification...</p>
          </div>
        </div>
      </LayoutSimple>
    )
  }

  return <>{children}</>
}
