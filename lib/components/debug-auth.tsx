"use client"

import { useAuthGlobal } from "@/lib/hooks/use-auth-global"
import { useDashboardKPIs, useStockAlerts } from "@/lib/hooks/use-api-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"

export function DebugAuth() {
  const isAuthenticated = useAuthGlobal()
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useDashboardKPIs()
  const { data: alerts, isLoading: alertsLoading, error: alertsError } = useStockAlerts()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug - État d'Authentification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span>État d'authentification:</span>
          <Badge className={isAuthenticated ? "bg-green-500" : "bg-red-500"}>
            {isAuthenticated ? "Connecté" : "Non connecté"}
          </Badge>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Token localStorage:</h3>
          <code className="text-xs bg-gray-100 p-2 rounded block">
            {typeof window !== 'undefined' ? localStorage.getItem("gesfarm_token") || "Aucun token" : "Côté serveur"}
          </code>
        </div>

        <div>
          <h3 className="font-semibold mb-2">KPIs Dashboard:</h3>
          <div className="text-sm">
            <p>Loading: {kpisLoading ? "Oui" : "Non"}</p>
            <p>Error: {kpisError ? kpisError.message : "Aucune erreur"}</p>
            <p>Data: {kpis ? JSON.stringify(kpis, null, 2) : "Aucune donnée"}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Stock Alerts:</h3>
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
