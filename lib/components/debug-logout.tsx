"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { useLogout } from "@/lib/hooks/use-auth"
import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { LogOut, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

export function DebugLogout() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const logoutMutation = useLogout()
  const isAuthenticated = useAuthGlobal()

  const checkAuthState = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("gesfarm_token") : null
    const user = typeof window !== 'undefined' ? localStorage.getItem("gesfarm_user") : null
    
    setDebugInfo({
      isAuthenticated,
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : null,
      user: user ? JSON.parse(user) : null,
      timestamp: new Date().toISOString()
    })
  }

  const handleLogout = async () => {
    console.log("Début de la déconnexion...")
    checkAuthState()
    
    try {
      await logoutMutation.mutateAsync()
      console.log("Déconnexion réussie")
      toast.success("Déconnexion réussie !")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      toast.error(`Erreur lors de la déconnexion: ${error}`)
    }
    
    // Vérifier l'état après déconnexion
    setTimeout(() => {
      checkAuthState()
    }, 1000)
  }

  const forceLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("gesfarm_token")
      localStorage.removeItem("gesfarm_user")
      window.location.reload()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LogOut className="h-5 w-5 mr-2" />
          Debug Déconnexion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Button onClick={checkAuthState} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Vérifier l'état
          </Button>
          
          <Button 
            onClick={handleLogout} 
            disabled={logoutMutation.isPending}
            variant="destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {logoutMutation.isPending ? "Déconnexion..." : "Déconnexion API"}
          </Button>
          
          <Button 
            onClick={forceLogout} 
            variant="outline"
            className="text-red-600"
          >
            Force Logout (localStorage)
          </Button>
        </div>

        {Object.keys(debugInfo).length > 0 && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <h4 className="font-semibold mb-2">État d'authentification :</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {logoutMutation.error && (
          <div className="mt-4 p-3 bg-red-100 rounded">
            <h4 className="font-semibold text-red-800 mb-2">Erreur :</h4>
            <pre className="text-xs text-red-700 overflow-auto">
              {JSON.stringify(logoutMutation.error, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
