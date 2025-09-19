"use client"

import { LayoutMinimal } from "@/lib/components/layout/layout-minimal"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { ShieldX, Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <LayoutMinimal>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ShieldX className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">401 - Non autorisé</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Tableau de bord
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p className="text-xs text-gray-400">
                Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutMinimal>
  )
}