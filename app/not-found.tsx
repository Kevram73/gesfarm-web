"use client"

import { LayoutMinimal } from "@/lib/components/layout/layout-minimal"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { FileX, Home, ArrowLeft, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <LayoutMinimal>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">GESFARM</h1>
          </div>

          {/* Page d'erreur 404 */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <FileX className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Page Non Trouvée
              </CardTitle>
              <p className="text-gray-600 text-sm">
                La page que vous recherchez n'existe pas ou a été déplacée.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-300 mb-2">404</div>
                <p className="text-sm text-gray-500">
                  Erreur: Page non trouvée
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => router.back()} 
                  variant="outline" 
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la page précédente
                </Button>
                
                <Button 
                  onClick={() => router.push("/dashboard")} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Aller au Dashboard
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-400">
                  Si vous pensez qu'il s'agit d'une erreur, contactez le support technique.
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
  )
}
