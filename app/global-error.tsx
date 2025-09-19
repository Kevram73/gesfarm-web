"use client"

import { useEffect } from "react"
import { LayoutMinimal } from "@/lib/components/layout/layout-minimal"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log l'erreur globale pour le debugging
    console.error("Erreur globale de l'application:", error)
  }, [error])

  const handleRefresh = () => {
    reset()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <html>
      <body>
        <LayoutMinimal>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
            <div className="w-full max-w-md">
              {/* Logo et titre */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">G</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">GESFARM</h1>
              </div>

              {/* Page d'erreur globale */}
              <Card className="shadow-xl border-0">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-gray-900">
                    Erreur Critique
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Une erreur critique s'est produite dans l'application.
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-300 mb-2">💥</div>
                    <p className="text-sm text-gray-500">
                      Erreur globale de l'application
                    </p>
                  </div>

                  {/* Détails de l'erreur en mode développement */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">Détails de l'erreur (dev)</span>
                      </div>
                      <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                        {error.message}
                      </pre>
                      {error.digest && (
                        <p className="text-xs text-gray-500 mt-2">
                          ID d'erreur: {error.digest}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={handleRefresh} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Réessayer
                    </Button>
                    
                    <Button 
                      onClick={handleGoHome} 
                      variant="outline" 
                      className="w-full"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Retour à l'accueil
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-xs text-gray-400">
                      Si le problème persiste, contactez le support technique.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="text-center mt-8">
                <p className="text-xs text-gray-500">
                  © 2024 GESFARM. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        </LayoutMinimal>
      </body>
    </html>
  )
}
