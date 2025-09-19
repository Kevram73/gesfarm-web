"use client"

import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { AlertTriangle, FileX, ServerCrash, Bug } from "lucide-react"

export default function TestErrorsPage() {
  const trigger404 = () => {
    window.location.href = "/page-inexistante"
  }

  const trigger500 = () => {
    throw new Error("Erreur 500 simulée pour les tests")
  }

  const triggerGlobalError = () => {
    // Simuler une erreur globale
    setTimeout(() => {
      throw new Error("Erreur globale simulée")
    }, 100)
  }

  const triggerClientError = () => {
    // Simuler une erreur côté client
    const element = document.getElementById("element-inexistant")
    if (element) {
      element.innerHTML = "Ceci ne devrait pas s'afficher"
    }
  }

  return (
    <LayoutSimple>
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bug className="mr-2 h-6 w-6" />
              Test des Pages d'Erreur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Test 404 */}
              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <FileX className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">Erreur 404</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Teste la page d'erreur 404 (Page non trouvée)
                  </p>
                  <Button 
                    onClick={trigger404}
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Déclencher 404
                  </Button>
                </CardContent>
              </Card>

              {/* Test 500 */}
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <ServerCrash className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-lg">Erreur 500</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Teste la page d'erreur 500 (Erreur serveur)
                  </p>
                  <Button 
                    onClick={trigger500}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Déclencher 500
                  </Button>
                </CardContent>
              </Card>

              {/* Test Erreur Globale */}
              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Erreur Globale</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Teste la page d'erreur globale
                  </p>
                  <Button 
                    onClick={triggerGlobalError}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Déclencher Erreur Globale
                  </Button>
                </CardContent>
              </Card>

              {/* Test Erreur Client */}
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Bug className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Erreur Client</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Teste une erreur côté client
                  </p>
                  <Button 
                    onClick={triggerClientError}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Déclencher Erreur Client
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Attention</span>
              </div>
              <p className="text-sm text-yellow-700">
                Ces boutons déclenchent des erreurs réelles pour tester les pages d'erreur. 
                Utilisez-les uniquement en mode développement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutSimple>
  )
}
