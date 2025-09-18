"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { Card } from "@/lib/components/ui/card"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { useLogin, useProfile, useLogout } from "@/lib/hooks/use-auth"
import { toast } from "react-hot-toast"
import { DebugAuth } from "./debug-auth"
import { TestEndpoints } from "./test-endpoints"
import { TestConnection } from "./test-connection"
import { TestCattleEndpoint } from "./test-cattle-endpoint"
import { TestApiStructure } from "./test-api-structure"
import { TestDeleteCattle } from "./test-delete-cattle"
import { DebugCattleData } from "./debug-cattle-data"
import { DebugPoultryData } from "./debug-poultry-data"
import { DebugControlledInputs } from "./debug-controlled-inputs"
import { DebugStockData } from "./debug-stock-data"
import { DebugLogout } from "./debug-logout"
import { TestLogoutApi } from "./test-logout-api"
import { DebugHydration } from "./debug-hydration"

export function ApiTest() {
  const [email, setEmail] = useState("admin@gesfarm.com")
  const [password, setPassword] = useState("password")
  const router = useRouter()

  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile()

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({ email, password })
      toast.success("Connexion réussie !")
      // Rediriger vers le dashboard après connexion réussie
      router.push("/")
    } catch (error: any) {
      toast.error(`Erreur de connexion: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success("Déconnexion réussie !")
      // La redirection est gérée automatiquement dans le hook useLogout
    } catch (error: any) {
      toast.error(`Erreur lors de la déconnexion: ${error.message}`)
    }
  }

  return (
    <>
      <DebugControlledInputs />
      <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Test de connexion API GESFARM</h2>
        
        {/* Formulaire de connexion */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gesfarm.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="flex-1"
            >
              {loginMutation.isPending ? "Connexion..." : "Se connecter"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Déconnexion..." : "Déconnexion"}
            </Button>
          </div>
          
          {profile && (
            <div className="mt-4">
              <Button 
                onClick={() => router.push("/")}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Aller au Dashboard
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Statut de la connexion */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statut de la connexion</h3>
        
        {profileLoading && (
          <p className="text-blue-600">Chargement du profil...</p>
        )}
        
        {profileError && (
          <div className="text-red-600">
            <p>Erreur: {profileError.message}</p>
            <p className="text-sm mt-2">
              Vérifiez que l'API Laravel est démarrée sur http://localhost:8000
            </p>
          </div>
        )}
        
        {profile && (
          <div className="text-green-600">
            <p className="font-semibold">✅ Connexion réussie !</p>
            <div className="mt-2 text-sm">
              <p><strong>Nom:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Rôles:</strong> {profile.roles?.join(", ") || "Aucun rôle"}</p>
            </div>
          </div>
        )}
        
        {!profile && !profileLoading && !profileError && (
          <p className="text-gray-600">Non connecté</p>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Instructions</h3>
        <div className="text-sm space-y-2">
          <p>1. Assurez-vous que l'API Laravel est démarrée :</p>
          <code className="block bg-gray-100 p-2 rounded">
            cd C:\Users\LENOVO\Documents\codes\gesfarm<br/>
            php artisan serve
          </code>
          
          <p>2. L'API doit être accessible sur http://localhost:8000</p>
          
          <p>3. Utilisez les identifiants par défaut ou créez un compte</p>
          
          <p>4. Si vous obtenez une erreur CORS, vérifiez la configuration dans Laravel</p>
        </div>
      </Card>

      {/* Composant de debug */}
      <DebugAuth />
      
      {/* Test des endpoints */}
      <TestEndpoints />
      
      {/* Test de connexion */}
      <TestConnection />
      
      {/* Test spécifique cattle */}
      <TestCattleEndpoint />
      
      {/* Test structure des endpoints */}
      <TestApiStructure />
      
      {/* Test suppression bovin */}
      <TestDeleteCattle />
      
      {/* Debug données bovins */}
      <DebugCattleData />
      
      {/* Debug données volaille */}
      <DebugPoultryData />
      
              {/* Debug données stock */}
              <DebugStockData />
              
              {/* Debug déconnexion */}
              <DebugLogout />
              
              {/* Test API logout */}
              <TestLogoutApi />
              
              {/* Debug hydratation */}
              <DebugHydration />
              </div>
            </>
          )
        }
