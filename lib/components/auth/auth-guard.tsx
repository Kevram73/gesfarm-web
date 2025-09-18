"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { Layout } from "@/lib/components/layout"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/" }: AuthGuardProps) {
  const isAuthenticated = useAuthGlobal()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  // Pendant la vérification de l'authentification
  if (typeof window === 'undefined') {
    return null // Pas de rendu côté serveur
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Vérification de l'authentification...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return <>{children}</>
}
