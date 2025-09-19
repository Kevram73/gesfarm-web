"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  requiredPermissions?: string[]
  requiredRole?: string
}

export function AuthGuard({ 
  children, 
  redirectTo = "/",
  requiredPermissions = [],
  requiredRole
}: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true)
  const isAuthenticated = useAuthGlobal()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié
        if (!isAuthenticated) {
          console.log("AuthGuard: Utilisateur non authentifié, redirection vers", redirectTo)
          router.push(redirectTo)
          return
        }

        // Vérifier les permissions si spécifiées
        if (requiredPermissions.length > 0) {
          const authData = JSON.parse(localStorage.getItem("gesfarm_auth") || "{}")
          const userPermissions = authData.user?.permissions || []
          
          const hasAllPermissions = requiredPermissions.every(permission => 
            userPermissions.includes(permission)
          )
          
          if (!hasAllPermissions) {
            console.log("AuthGuard: Permissions insuffisantes")
            router.push("/unauthorized")
            return
          }
        }

        // Vérifier le rôle si spécifié
        if (requiredRole) {
          const authData = JSON.parse(localStorage.getItem("gesfarm_auth") || "{}")
          const userRoles = authData.user?.roles || []
          
          if (!userRoles.includes(requiredRole)) {
            console.log("AuthGuard: Rôle insuffisant")
            router.push("/unauthorized")
            return
          }
        }

        console.log("AuthGuard: Authentification validée")
        setIsChecking(false)
      } catch (error) {
        console.error("AuthGuard: Erreur lors de la vérification:", error)
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [isAuthenticated, router, redirectTo, requiredPermissions, requiredRole])

  // Afficher un loader pendant la vérification
  if (isChecking) {
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

  // Si l'utilisateur n'est pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}