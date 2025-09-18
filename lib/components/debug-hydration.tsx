"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { ClientOnly } from "@/lib/components/ui/client-only"
import { formatDateTime } from "@/lib/utils"
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"

export function DebugHydration() {
  const [isClient, setIsClient] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date())
    setHydrated(true)
  }, [])

  const refreshTime = () => {
    setCurrentTime(new Date())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Debug Hydratation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* État de l'hydratation */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">État d'hydratation:</span>
          {hydrated ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Hydraté
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-800">
              <XCircle className="h-3 w-3 mr-1" />
              En cours
            </Badge>
          )}
        </div>

        {/* Test avec Date.now() - PROBLÉMATIQUE */}
        <div className="p-3 bg-red-50 rounded border border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ Problématique (Date.now())</h4>
          <p className="text-sm text-red-700 mb-2">
            Cette approche cause des erreurs d'hydratation car Date.now() change entre le serveur et le client.
          </p>
          <div className="text-sm">
            <strong>Timestamp:</strong> {Date.now()}
          </div>
        </div>

        {/* Test avec état client - CORRECT */}
        <div className="p-3 bg-green-50 rounded border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">✅ Correct (État client)</h4>
          <p className="text-sm text-green-700 mb-2">
            Cette approche utilise un état client pour éviter les erreurs d'hydratation.
          </p>
          <div className="text-sm">
            <strong>Timestamp:</strong> {isClient ? Date.now() : "Chargement..."}
          </div>
        </div>

        {/* Test avec ClientOnly - RECOMMANDÉ */}
        <div className="p-3 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 Recommandé (ClientOnly)</h4>
          <p className="text-sm text-blue-700 mb-2">
            Cette approche utilise le composant ClientOnly pour un rendu sûr.
          </p>
          <div className="text-sm">
            <strong>Timestamp:</strong>{" "}
            <ClientOnly fallback={<span className="text-gray-500">Chargement...</span>}>
              {Date.now()}
            </ClientOnly>
          </div>
        </div>

        {/* Test avec formatage de date */}
        <div className="p-3 bg-purple-50 rounded border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">📅 Formatage de date</h4>
          <p className="text-sm text-purple-700 mb-2">
            Test du formatage de date avec gestion d'hydratation.
          </p>
          <div className="text-sm space-y-1">
            <div>
              <strong>Date actuelle:</strong>{" "}
              <ClientOnly fallback={<span className="text-gray-500">Chargement...</span>}>
                {currentTime ? formatDateTime(currentTime) : "Non disponible"}
              </ClientOnly>
            </div>
            <Button 
              onClick={refreshTime} 
              size="sm" 
              variant="outline"
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Informations de debug */}
        <div className="p-3 bg-gray-50 rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🔍 Informations de debug</h4>
          <div className="text-xs space-y-1">
            <div><strong>isClient:</strong> {isClient.toString()}</div>
            <div><strong>hydrated:</strong> {hydrated.toString()}</div>
            <div><strong>typeof window:</strong> {typeof window}</div>
            <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
