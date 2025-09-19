"use client"

import { LayoutMinimal } from "@/lib/components/layout/layout-minimal"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Error400Page() {
  const router = useRouter()

  return (
    <LayoutMinimal>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Erreur 400
            </CardTitle>
            <p className="text-gray-600">
              Requête incorrecte
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                La requête que vous avez envoyée est incorrecte ou malformée. 
                Veuillez vérifier les informations saisies et réessayer.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retour
              </Button>
              
              <Button 
                onClick={() => router.push("/")}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Si le problème persiste, contactez l'administrateur.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutMinimal>
  )
}
