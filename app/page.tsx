"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const isAuthenticated = useAuthGlobal()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isAuthenticated) {
        // Si authentifié, rediriger vers le dashboard
        router.push("/dashboard")
      } else {
        // Si pas authentifié, rediriger vers le login
        router.push("/login")
      }
    }
  }, [isAuthenticated, router])

  return (
    <LayoutSimple>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    </LayoutSimple>
  )
}