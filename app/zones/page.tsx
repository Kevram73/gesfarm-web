"use client"

import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { Map } from "@/lib/components/maps"
import { useZones, useDeleteZone } from "@/lib/hooks/use-api-data"
import { ConfirmDialog } from "@/lib/components/ui/confirm-dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MapPin, Plus, Search, Filter, Building, TreePine, Droplets, Wheat, Edit, Trash2, BarChart3 } from "lucide-react"

export default function ZonesPage() {
  const { data: zonesData, isLoading } = useZones({ per_page: 20 })
  const deleteZoneMutation = useDeleteZone()
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    zoneId: number | null
    zoneName: string
  }>({
    isOpen: false,
    zoneId: null,
    zoneName: ""
  })
  
  if (isLoading) {
    return (
      <LayoutSimple>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Zones</h1>
            <p className="text-gray-300 mt-2">
              Chargement des zones de l'exploitation...
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </LayoutSimple>
    )
  }

  const zones = zonesData?.data || []
  
  // Fonctions de gestion
  const handleDelete = async () => {
    if (deleteDialog.zoneId) {
      try {
        await deleteZoneMutation.mutateAsync(deleteDialog.zoneId)
        setDeleteDialog({ isOpen: false, zoneId: null, zoneName: "" })
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const openDeleteDialog = (zoneId: number, zoneName: string) => {
    setDeleteDialog({ isOpen: true, zoneId, zoneName })
  }
  
  // Données factices pour les zones (fallback)
  const fallbackZones = [
    {
      id: 1,
      name: "Poulailler Nord",
      description: "Poulailler principal pour pondeuses",
      type: "building",
      area: 200,
      coordinates: {
        type: "Polygon",
        coordinates: [[[2.3522, 48.8566], [2.3522, 48.8576], [2.3532, 48.8576], [2.3532, 48.8566], [2.3522, 48.8566]]]
      }
    },
    {
      id: 2,
      name: "Poulailler Sud",
      description: "Poulailler pour volailles de chair",
      type: "building",
      area: 150,
      coordinates: {
        type: "Polygon",
        coordinates: [[[2.3522, 48.8566], [2.3522, 48.8576], [2.3532, 48.8576], [2.3532, 48.8566], [2.3522, 48.8566]]]
      }
    },
    {
      id: 3,
      name: "Pâturage Nord",
      description: "Pâturage principal pour bovins",
      type: "pasture",
      area: 5000,
      coordinates: {
        type: "Polygon",
        coordinates: [[[2.3522, 48.8566], [2.3522, 48.8576], [2.3532, 48.8576], [2.3532, 48.8566], [2.3522, 48.8566]]]
      }
    },
    {
      id: 4,
      name: "Parcelle Maïs",
      description: "Parcelle de culture de maïs",
      type: "cultivation",
      area: 3000,
      coordinates: {
        type: "Polygon",
        coordinates: [[[2.3522, 48.8566], [2.3522, 48.8576], [2.3532, 48.8576], [2.3532, 48.8566], [2.3522, 48.8566]]]
      }
    },
    {
      id: 5,
      name: "Point d'eau",
      description: "Bassin d'eau pour les animaux",
      type: "water",
      area: 50,
      coordinates: {
        type: "Point",
        coordinates: [2.3527, 48.8571]
      }
    }
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "building": return "Bâtiment"
      case "pasture": return "Pâturage"
      case "cultivation": return "Culture"
      case "water": return "Point d'eau"
      case "enclosure": return "Enclos"
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "building": return "bg-blue-500"
      case "pasture": return "bg-green-500"
      case "cultivation": return "bg-yellow-500"
      case "water": return "bg-cyan-500"
      case "enclosure": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "building": return Building
      case "pasture": return TreePine
      case "cultivation": return Wheat
      case "water": return Droplets
      default: return MapPin
    }
  }

  // Marqueurs pour la carte
  const mapMarkers = zones.map(zone => ({
    position: zone.coordinates.type === "Point" 
      ? zone.coordinates.coordinates 
      : [zone.coordinates.coordinates[0][0][0], zone.coordinates.coordinates[0][0][1]],
    title: zone.name,
    description: zone.description
  }))

  return (
    <LayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cartographie des Zones</h1>
            <p className="text-gray-600 mt-2">
              Visualisation et gestion des zones de votre exploitation.
            </p>
          </div>
          <Button onClick={() => router.push('/zones/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle zone
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
              <MapPin className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {zones.length}
              </div>
              <p className="text-xs text-gray-600">
                Zones enregistrées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bâtiments</CardTitle>
              <Building className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {zones.filter(zone => zone.type === "building").length}
              </div>
              <p className="text-xs text-gray-600">
                Structures
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pâturages</CardTitle>
              <TreePine className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {zones.filter(zone => zone.type === "pasture").length}
              </div>
              <p className="text-xs text-gray-600">
                Zones d'élevage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cultures</CardTitle>
              <Wheat className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {zones.filter(zone => zone.type === "cultivation").length}
              </div>
              <p className="text-xs text-gray-600">
                Parcelles cultivées
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Carte */}
        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble de l'exploitation</CardTitle>
          </CardHeader>
          <CardContent>
            <Map
              center={[48.8571, 2.3527]}
              zoom={15}
              markers={mapMarkers}
              className="h-[500px] w-full"
            />
          </CardContent>
        </Card>

        {/* Recherche et filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une zone..."
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

        {/* Liste des zones */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => {
            const IconComponent = getTypeIcon(zone.type)
            
            return (
              <Card key={zone.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">{zone.name}</CardTitle>
                    </div>
                    <Badge className={`${getTypeColor(zone.type)} text-white`}>
                      {getTypeLabel(zone.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{zone.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Surface:</span>
                      <span className="font-medium text-gray-900">
                        {zone.area.toLocaleString()} m²
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-gray-900">
                        {getTypeLabel(zone.type)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Coordonnées:</span>
                      <span className="text-gray-900 text-xs">
                        {zone.coordinates.type === "Point" 
                          ? `${zone.coordinates.coordinates[0].toFixed(4)}, ${zone.coordinates.coordinates[1].toFixed(4)}`
                          : "Polygone"
                        }
                      </span>
                    </div>
                    
                    <div className="pt-2 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/zones/edit/${zone.id}`)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/zones/details/${zone.id}`)}
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Détails
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(zone.id, zone.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, zoneId: null, zoneName: "" })}
        onConfirm={handleDelete}
        title="Supprimer la zone"
        message={`Êtes-vous sûr de vouloir supprimer la zone "${deleteDialog.zoneName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        isLoading={deleteZoneMutation.isPending}
        variant="destructive"
      />
    </LayoutSimple>
  )
}
