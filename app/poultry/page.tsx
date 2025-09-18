"use client"

import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { usePoultryFlocks } from "@/lib/hooks/use-api-data"
import { useRouter } from "next/navigation"
import { Egg, Plus, Users, TrendingUp, Calendar } from "lucide-react"

export default function PoultryPage() {
  const router = useRouter()
  const { data: flocksData, isLoading } = usePoultryFlocks({ per_page: 20 })

  if (isLoading) {
    return (
      <LayoutSimple>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion Avicole</h1>
            <p className="text-gray-600 mt-2">
              Chargement des lots de volailles...
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </LayoutSimple>
    )
  }

  const flocks = flocksData?.data || []
  
  // Debug: Log des données pour vérifier
  console.log("Poultry flocks data:", flocksData)
  console.log("Flocks array:", flocks)
  console.log("First flock:", flocks[0])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "layer": return "Pondeuses"
      case "broiler": return "Chair"
      case "duck": return "Canards"
      case "turkey": return "Dindes"
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "layer": return "bg-blue-500"
      case "broiler": return "bg-green-500"
      case "duck": return "bg-yellow-500"
      case "turkey": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion Avicole</h1>
            <p className="text-gray-600 mt-2">
              Suivi des lots de volailles et de leur production.
            </p>
          </div>
          <Button onClick={() => router.push('/poultry/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau lot
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volailles</CardTitle>
              <Egg className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {flocks.reduce((sum, flock) => sum + flock.current_quantity, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                {flocks.length} lot{flocks.length > 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pondeuses</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {flocks
                  .filter(f => f.type === "layer")
                  .reduce((sum, flock) => sum + flock.current_quantity, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                Production d'œufs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chair</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {flocks
                  .filter(f => f.type === "broiler")
                  .reduce((sum, flock) => sum + flock.current_quantity, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                Production de viande
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mortalité</CardTitle>
              <Calendar className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {flocks.reduce((sum, flock) => {
                  const mortality = flock.initial_quantity - flock.current_quantity
                  return sum + (mortality > 0 ? mortality : 0)
                }, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                Depuis l'arrivée
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des lots */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flocks.map((flock) => {
            const mortalityRate = ((flock.initial_quantity - flock.current_quantity) / flock.initial_quantity) * 100
            const daysSinceArrival = Math.floor((new Date().getTime() - new Date(flock.arrival_date).getTime()) / (1000 * 60 * 60 * 24))
            
            return (
              <Card key={flock.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Egg className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">{flock.flock_number}</CardTitle>
                    </div>
                    <Badge className={`${getTypeColor(flock.type)} text-white`}>
                      {getTypeLabel(flock.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{flock.breed}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quantité actuelle:</span>
                      <span className="font-medium text-gray-900">
                        {flock.current_quantity.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quantité initiale:</span>
                      <span className="text-gray-900">
                        {flock.initial_quantity.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taux de mortalité:</span>
                      <span className={`font-medium ${
                        mortalityRate > 10 ? "text-red-600" : 
                        mortalityRate > 5 ? "text-yellow-600" : "text-green-600"
                      }`}>
                        {mortalityRate.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Zone:</span>
                      <span className="text-gray-900 text-sm">
                        {flock.zone?.name || "Non assignée"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Âge:</span>
                      <span className="text-gray-900 text-sm">
                        {daysSinceArrival} jour{daysSinceArrival > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Arrivée:</span>
                      <span className="text-gray-900 text-sm">
                        {new Date(flock.arrival_date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    
                    <div className="pt-2 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/poultry/edit/${flock.id}`)}
                      >
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {flocksData?.pagination && flocksData.pagination.last_page > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
