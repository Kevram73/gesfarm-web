"use client"

import { AlertTriangle, RefreshCw, Wifi, Clock } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

interface CorsErrorProps {
  error?: any
  onRetry?: () => void
  title?: string
  description?: string
}

export function CorsError({ 
  error, 
  onRetry, 
  title = "Erreur de connexion",
  description = "Impossible de se connecter au serveur API. Vérifiez votre connexion internet et réessayez."
}: CorsErrorProps) {
  const isCorsError = error?.corsError || 
    error?.code === 'ERR_NETWORK' ||
    error?.message?.includes('CORS') ||
    error?.message?.includes('cross-origin')
  
  const isTimeoutError = error?.timeoutError ||
    error?.code === 'ECONNABORTED' ||
    error?.message?.includes('timeout') ||
    error?.message?.includes('exceeded')

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          {isTimeoutError ? (
            <Clock className="h-6 w-6 text-red-600" />
          ) : isCorsError ? (
            <Wifi className="h-6 w-6 text-red-600" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-red-600" />
          )}
        </div>
        <CardTitle className="text-lg font-semibold text-red-900">
          {isTimeoutError ? "Timeout de connexion" : title}
        </CardTitle>
        <CardDescription className="text-sm text-red-700">
          {isTimeoutError ? (
            <>
              Le serveur met trop de temps à répondre.
              <br />
              Vérifiez votre connexion internet et réessayez.
            </>
          ) : isCorsError ? (
            <>
              Problème de configuration CORS détecté.
              <br />
              Le serveur API n'autorise pas les requêtes depuis ce domaine.
            </>
          ) : (
            description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-xs text-red-800 font-mono">
              {error.message || "Erreur inconnue"}
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          )}
          
          <Button 
            variant="ghost"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Recharger la page
          </Button>
        </div>
        
        {(isCorsError || isTimeoutError) && (
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Solutions possibles :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Vérifiez votre connexion internet</li>
              {isTimeoutError && <li>Le serveur peut être surchargé, réessayez plus tard</li>}
              {isCorsError && <li>Contactez l'administrateur du serveur API</li>}
              <li>Essayez de rafraîchir la page</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
