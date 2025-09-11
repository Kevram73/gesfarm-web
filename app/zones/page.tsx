"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { Map } from "@/lib/components/maps"
import { MapPin, Plus, Search, Filter, Building, TreePine, Droplets, Wheat } from "lucide-react"

export default function ZonesPage() {
  // Données factices pour les zones
  const zones = [
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
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cartographie des Zones</h1>
            <p className="text-gray-600 mt-2">
              Visualisation et gestion des zones de votre exploitation.
            </p>
          </div>
          <Button>
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
                      <Button variant="outline" size="sm" className="flex-1">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Statistiques
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
