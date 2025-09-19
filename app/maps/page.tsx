"use client"

import { useState } from "react"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Map } from "@/lib/components/maps/map"
import { MapPin, Search, Plus, Trash2 } from "lucide-react"

interface Marker {
  id: string
  position: [number, number]
  title: string
  description: string
}

const defaultMarkers: Marker[] = [
  {
    id: "1",
    position: [48.8566, 2.3522],
    title: "Paris",
    description: "Capitale de la France"
  },
  {
    id: "2",
    position: [45.7640, 4.8357],
    title: "Lyon",
    description: "Ville de la gastronomie"
  },
  {
    id: "3",
    position: [43.2965, 5.3698],
    title: "Marseille",
    description: "Port de la Méditerranée"
  }
]

export default function MapsPage() {
  const [markers, setMarkers] = useState<Marker[]>(defaultMarkers)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMarker, setNewMarker] = useState({
    title: "",
    description: "",
    lat: "",
    lng: ""
  })

  const addMarker = () => {
    if (newMarker.title && newMarker.lat && newMarker.lng) {
      const marker: Marker = {
        id: Date.now().toString(),
        position: [parseFloat(newMarker.lat), parseFloat(newMarker.lng)],
        title: newMarker.title,
        description: newMarker.description
      }
      setMarkers([...markers, marker])
      setNewMarker({ title: "", description: "", lat: "", lng: "" })
    }
  }

  const removeMarker = (id: string) => {
    setMarkers(markers.filter(marker => marker.id !== id))
  }

  const filteredMarkers = markers.filter(marker =>
    marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    marker.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <LayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cartes</h1>
          <p className="text-muted-foreground">
            Visualisation interactive avec React Leaflet.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Carte principale */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Carte interactive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Map
                  center={[46.6034, 1.8883]} // Centre de la France
                  zoom={6}
                  markers={filteredMarkers}
                  className="h-[500px] w-full"
                />
              </CardContent>
            </Card>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-6">
            {/* Recherche */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="search">Rechercher un marqueur</Label>
                  <Input
                    id="search"
                    placeholder="Nom ou description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ajouter un marqueur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un marqueur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    placeholder="Nom du lieu"
                    value={newMarker.title}
                    onChange={(e) => setNewMarker({ ...newMarker, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Description du lieu"
                    value={newMarker.description}
                    onChange={(e) => setNewMarker({ ...newMarker, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude *</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      placeholder="48.8566"
                      value={newMarker.lat}
                      onChange={(e) => setNewMarker({ ...newMarker, lat: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude *</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      placeholder="2.3522"
                      value={newMarker.lng}
                      onChange={(e) => setNewMarker({ ...newMarker, lng: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={addMarker} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            {/* Liste des marqueurs */}
            <Card>
              <CardHeader>
                <CardTitle>Marqueurs ({filteredMarkers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredMarkers.map((marker) => (
                    <div
                      key={marker.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{marker.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                        </p>
                        {marker.description && (
                          <p className="text-xs text-muted-foreground">{marker.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMarker(marker.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutSimple>
  )
}
