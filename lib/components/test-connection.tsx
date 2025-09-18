"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { useLogin, useProfile } from "@/lib/hooks/use-auth"
import { useDashboardKPIs, useStockAlerts } from "@/lib/hooks/use-api-data"
import { toast } from "react-hot-toast"

export function TestConnection() {
  const [email, setEmail] = useState("admin@gesfarm.com")
  const [password, setPassword] = useState("password")
  
  const loginMutation = useLogin()
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile()
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useDashboardKPIs()
  const { data: alerts, isLoading: alertsLoading, error: alertsError } = useStockAlerts()

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({ email, password })
      toast.success("Connexion réussie !")
    } catch (error: any) {
      toast.error(`Erreur de connexion: ${error.response?.data?.message || error.message}`)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Test de Connexion et Données</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire de connexion */}
        <div className="space-y-4">
          <h3 className="font-semibold">Connexion</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-email">Email</Label>
              <Input
                id="test-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="test-password">Mot de passe</Label>
              <Input
                id="test-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="w-full"
          >
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </Button>
        </div>

        {/* État du profil */}
        <div className="space-y-2">
          <h3 className="font-semibold">Profil Utilisateur</h3>
          <div className="text-sm">
            <p>Loading: {profileLoading ? "Oui" : "Non"}</p>
            <p>Error: {profileError ? profileError.message : "Aucune erreur"}</p>
            <p>Data: {profile ? JSON.stringify(profile, null, 2) : "Aucune donnée"}</p>
          </div>
        </div>

        {/* État des KPIs */}
        <div className="space-y-2">
          <h3 className="font-semibold">KPIs Dashboard</h3>
          <div className="text-sm">
            <p>Loading: {kpisLoading ? "Oui" : "Non"}</p>
            <p>Error: {kpisError ? kpisError.message : "Aucune erreur"}</p>
            <p>Data: {kpis ? JSON.stringify(kpis, null, 2) : "Aucune donnée"}</p>
          </div>
        </div>

        {/* État des alertes */}
        <div className="space-y-2">
          <h3 className="font-semibold">Stock Alerts</h3>
          <div className="text-sm">
            <p>Loading: {alertsLoading ? "Oui" : "Non"}</p>
            <p>Error: {alertsError ? alertsError.message : "Aucune erreur"}</p>
            <p>Data: {alerts ? JSON.stringify(alerts, null, 2) : "Aucune donnée"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
