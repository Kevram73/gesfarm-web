"use client"

import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { useCrops } from "@/lib/hooks/use-api-data"
import { Wheat, Plus, Search, Filter, Calendar, MapPin, TrendingUp, Droplets } from "lucide-react"

export default function CropsPage() {
  const { data: cropsData, isLoading } = useCrops({ per_page: 20 })

  if (isLoading) {
    return (
      <LayoutSimple>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion des Cultures</h1>
            <p className="text-gray-600 mt-2">
              Chargement des cultures...
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

  const crops = cropsData?.data || []

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "planted": return "Planté"
      case "growing": return "En croissance"
      case "harvested": return "Récolté"
      case "failed": return "Échec"
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planted": return "bg-blue-500"
      case "growing": return "bg-green-500"
      case "harvested": return "bg-yellow-500"
      case "failed": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const calculateDaysSincePlanting = (plantingDate: string) => {
    const planting = new Date(plantingDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - planting.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateDaysToHarvest = (expectedHarvestDate: string) => {
    const harvest = new Date(expectedHarvestDate)
    const today = new Date()
    const diffTime = harvest.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <LayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion des Cultures</h1>
            <p className="text-gray-600 mt-2">
              Suivi des parcelles et des cultures de votre exploitation.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle culture
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cultures</CardTitle>
              <Wheat className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {crops.length}
              </div>
              <p className="text-xs text-gray-600">
                Parcelles en culture
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Croissance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {crops.filter(crop => crop.status === "growing").length}
              </div>
              <p className="text-xs text-gray-600">
                Cultures actives
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Surface Totale</CardTitle>
              <MapPin className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {crops.reduce((sum, crop) => sum + crop.planted_area, 0).toLocaleString()} m²
              </div>
              <p className="text-xs text-gray-600">
                Surface cultivée
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Récoltes</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {crops.filter(crop => crop.status === "harvested").length}
              </div>
              <p className="text-xs text-gray-600">
                Cultures récoltées
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une culture..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des cultures */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {crops.map((crop) => {
            const daysSincePlanting = calculateDaysSincePlanting(crop.planting_date)
            const daysToHarvest = crop.expected_harvest_date 
              ? calculateDaysToHarvest(crop.expected_harvest_date)
              : null
            
            return (
              <Card key={crop.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wheat className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">{crop.name}</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(crop.status)} text-white`}>
                      {getStatusLabel(crop.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{crop.variety}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Surface:</span>
                      <span className="font-medium text-gray-900">
                        {crop.planted_area.toLocaleString()} m²
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Zone:</span>
                      <span className="text-gray-900 text-sm">
                        {crop.zone?.name || "Non assignée"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Planté le:</span>
                      <span className="text-gray-900 text-sm">
                        {new Date(crop.planting_date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Âge:</span>
                      <span className="text-gray-900">
                        {daysSincePlanting} jour{daysSincePlanting > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {crop.expected_harvest_date && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Récolte prévue:</span>
                        <span className={`text-sm ${
                          daysToHarvest && daysToHarvest <= 7 ? "text-red-600 font-medium" : "text-gray-900"
                        }`}>
                          {new Date(crop.expected_harvest_date).toLocaleDateString("fr-FR")}
                          {daysToHarvest && (
                            <span className="ml-1">
                              ({daysToHarvest > 0 ? `dans ${daysToHarvest}j` : "en retard"})
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    
                    {crop.expected_yield && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rendement attendu:</span>
                        <span className="text-gray-900">
                          {crop.expected_yield.toLocaleString()} kg
                        </span>
                      </div>
                    )}
                    
                    {crop.actual_yield && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rendement réel:</span>
                        <span className="text-green-600 font-medium">
                          {crop.actual_yield.toLocaleString()} kg
                        </span>
                      </div>
                    )}
                    
                    {crop.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600 italic">
                          {crop.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-2 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/crops/edit/${crop.id}`)}
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
        {cropsData?.pagination && cropsData.pagination.last_page > 1 && (
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
    </LayoutSimple>
  )
}
