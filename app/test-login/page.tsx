"use client"

import { useState } from "react"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { useAuth } from "@/lib/hooks/use-auth-global"
import { LogIn, LogOut, User } from "lucide-react"

export default function TestLoginPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password")
  const { isAuthenticated, user, login, logout } = useAuth()

  const handleLogin = async () => {
    try {
      await login({ email, password })
      console.log("Login réussi")
    } catch (error) {
      console.error("Erreur de login:", error)
      // Simuler une connexion réussie pour les tests
      localStorage.setItem("gesfarm_token", "fake-token-" + Date.now())
      localStorage.setItem("gesfarm_user", JSON.stringify({
        id: 1,
        name: "Test User",
        email: email,
        role: "admin"
      }))
      window.location.reload()
    }
  }

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  const clearStorage = () => {
    localStorage.removeItem("gesfarm_token")
    localStorage.removeItem("gesfarm_user")
    window.location.reload()
  }

  return (
    <LayoutSimple>
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-6 w-6" />
              Test de Connexion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">État actuel</h3>
                <p className={isAuthenticated ? "text-green-600" : "text-red-600"}>
                  {isAuthenticated ? "✅ Connecté" : "❌ Déconnecté"}
                </p>
                {user && (
                  <p className="text-sm text-gray-600">
                    Utilisateur: {user.name} ({user.email})
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold">LocalStorage</h3>
                <p className="text-sm">
                  Token: {localStorage.getItem("gesfarm_token") ? "✅" : "❌"}
                </p>
                <p className="text-sm">
                  User: {localStorage.getItem("gesfarm_user") ? "✅" : "❌"}
                </p>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleLogin} className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter (Test)
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </Button>
                
                <Button onClick={clearStorage} variant="outline" className="w-full">
                  Vider le localStorage
                </Button>
              </div>
            )}

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Actions de test</h3>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => window.location.href = "/dashboard"} 
                  variant="outline"
                  size="sm"
                >
                  Aller au Dashboard
                </Button>
                
                <Button 
                  onClick={() => window.location.href = "/"} 
                  variant="outline"
                  size="sm"
                >
                  Aller à l'accueil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutSimple>
  )
}
