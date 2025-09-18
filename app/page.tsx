"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { useLogin } from "@/lib/hooks/use-auth"
import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { Loader2, LogIn, Shield, Users, BarChart3, Package } from "lucide-react"
import toast from "react-hot-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@gesfarm.com")
  const [password, setPassword] = useState("password")
  const router = useRouter()
  const loginMutation = useLogin()
  const isAuthenticated = useAuthGlobal()

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await loginMutation.mutateAsync({ email, password })
      toast.success("Connexion réussie !")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(`Erreur de connexion: ${error.response?.data?.message || error.message}`)
    }
  }

  // Si déjà connecté, ne pas afficher la page de login
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-2">
        {/* Section gauche - Informations */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              GESFARM
            </h1>
            <p className="text-xl text-gray-600">
              Système de gestion intégrée pour votre exploitation agropastorale
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gestion du Bétail</h3>
                <p className="text-sm text-gray-600">Suivez vos bovins et volailles</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics & Rapports</h3>
                <p className="text-sm text-gray-600">Analysez vos performances</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gestion des Stocks</h3>
                <p className="text-sm text-gray-600">Contrôlez vos inventaires</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire de connexion */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Connexion</CardTitle>
              <p className="text-gray-600">
                Accédez à votre tableau de bord
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gesfarm.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Se connecter
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Compte de démonstration
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Email: admin@gesfarm.com<br />
                  Mot de passe: password
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
