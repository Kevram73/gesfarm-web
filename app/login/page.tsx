"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react"
import toast from "react-hot-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulation d'authentification avec fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email === "admin@gesfarm.com" && password === "admin123") {
        // Stocker les données utilisateur
        localStorage.setItem("user", JSON.stringify({
          id: 1,
          name: "Admin GESFARM",
          email: "admin@gesfarm.com",
          role: "admin"
        }))
        localStorage.setItem("token", "fake-jwt-token")
        
        toast.success("Connexion réussie !")
        router.push("/")
      } else {
        toast.error("Email ou mot de passe incorrect")
      }
    } catch (error) {
      toast.error("Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">GESFARM</h1>
          <p className="text-gray-400">Plateforme de Gestion Agricole</p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Connexion</CardTitle>
            <CardDescription className="text-gray-400">
              Connectez-vous à votre compte GESFARM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gesfarm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter
                  </div>
                )}
              </Button>
            </form>

            {/* Informations de test */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Compte de test :</h3>
              <p className="text-xs text-gray-400">Email: admin@gesfarm.com</p>
              <p className="text-xs text-gray-400">Mot de passe: admin123</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 GESFARM - Plateforme de Gestion Agricole
          </p>
        </div>
      </div>
    </div>
  )
}