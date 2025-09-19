"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const isAuthenticated = useAuthGlobal()
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'authentification après le montage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("gesfarm_token")
      if (!token) {
        router.push(redirectTo)
      }
    }
  }, [router, redirectTo])

  // Pendant la vérification, afficher un loader
  if (typeof window === 'undefined') {
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

  // Si pas authentifié, ne rien afficher (la redirection se fera via useEffect)
  if (!isAuthenticated) {
    return (
      <LayoutSimple>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Redirection vers la page de connexion...</p>
          </div>
        </div>
      </LayoutSimple>
    )
  }

  // Si authentifié, afficher le contenu
  return <>{children}</>
}
