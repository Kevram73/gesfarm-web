"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { useAuth } from "@/lib/hooks/use-auth"
import { LayoutMinimal } from "@/lib/components/layout/layout-minimal"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Loader2, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  
  const isAuthenticated = useAuthGlobal()
  const { login, isLoading, error, clearError } = useAuth()
  const router = useRouter()

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      console.log("HomePage: Utilisateur authentifié, redirection vers dashboard")
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur quand l'utilisateur tape
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await login(formData)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useAuth
      console.error("Erreur de connexion:", error)
    }
  }

  // Si déjà authentifié, afficher un loader pendant la redirection
  if (isAuthenticated) {
    return (
      <LayoutMinimal>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Redirection vers le dashboard...</p>
          </div>
        </div>
      </LayoutMinimal>
    )
  }

  return (
    <LayoutMinimal>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="w-full max-w-md">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <h1 className="text-3xl font-bold text-white">GESFARM</h1>
            <p className="text-gray-300 mt-2">Gestion d'exploitation agropastorale</p>
          </div>

          {/* Formulaire de connexion */}
          <Card className="shadow-xl border-0 bg-gray-800">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-white flex items-center justify-center">
                <LogIn className="mr-2 h-6 w-6 text-blue-400" />
                Connexion
              </CardTitle>
              <p className="text-gray-300 text-sm">
                Connectez-vous à votre compte pour accéder au système
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Message d'erreur */}
                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-11 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Bouton de connexion */}
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Se connecter
                    </>
                  )}
                </Button>
              </form>
              
              {/* Liens utiles */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-300">
                  Pas encore de compte ?{" "}
                  <Link
                    href="/register"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Créer un compte
                  </Link>
                </p>
                <p className="text-sm text-gray-300">
                  <Link
                    href="/forgot-password"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Mot de passe oublié ?
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400">
              © 2024 GESFARM. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </LayoutMinimal>
  )
}