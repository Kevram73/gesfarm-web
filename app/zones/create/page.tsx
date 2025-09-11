"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { ArrowLeft, Save, MapPin } from "lucide-react"
import toast from "react-hot-toast"
import { Layout } from "@/lib/components/layout/layout"

interface Zone {
  id: number
  name: string
  type: string
  area: number
  coordinates: {
    latitude: number
    longitude: number
  }
  description: string
  soilType: string
  irrigationSystem: string
  currentUse: string
  plannedUse: string
  notes: string
  createdAt: string
  status: "active" | "inactive" | "maintenance"
}

export default function CreateZonePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    area: "",
    latitude: "",
    longitude: "",
    description: "",
    soilType: "",
    irrigationSystem: "",
    currentUse: "",
    plannedUse: "",
    notes: "",
    status: ""
  })

  const zoneTypes = [
    "Pâturage",
    "Culture",
    "Poulailler",
    "Étable",
    "Entrepôt",
    "Zone de stockage",
    "Zone de traitement",
    "Zone administrative",
    "Autre"
  ]

  const soilTypes = [
    "Argileux",
    "Sableux",
    "Limoneux",
    "Calcaire",
    "Acide",
    "Neutre",
    "Mixte",
    "Inconnu"
  ]

  const irrigationSystems = [
    "Aucun",
    "Pluie naturelle",
    "Arrosage manuel",
    "Goutte à goutte",
    "Aspersion",
    "Inondation",
    "Système automatisé",
    "Autre"
  ]

  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "En maintenance" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulation de création avec fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newZone: Zone = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        area: parseFloat(formData.area),
        coordinates: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        },
        description: formData.description,
        soilType: formData.soilType,
        irrigationSystem: formData.irrigationSystem,
        currentUse: formData.currentUse,
        plannedUse: formData.plannedUse,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        status: formData.status as "active" | "inactive" | "maintenance"
      }

      // Récupérer les zones existantes
      const existingZones = JSON.parse(localStorage.getItem("zones") || "[]")
      existingZones.push(newZone)
      localStorage.setItem("zones", JSON.stringify(existingZones))

      toast.success("Zone créée avec succès !")
      router.push("/zones")
    } catch (error) {
      toast.error("Erreur lors de la création de la zone")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Nouvelle Zone</h1>
              <p className="text-gray-400 mt-2">Ajouter une nouvelle zone à l'exploitation</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Informations de la Zone
            </CardTitle>
            <CardDescription className="text-gray-400">
              Remplissez les informations pour créer une nouvelle zone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informations de Base</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nom de la zone *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Zone A - Pâturage Nord"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-gray-300">Type de zone *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {zoneTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-gray-300">Superficie (hectares) *</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.01"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-300">Statut *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Description détaillée de la zone..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Coordonnées et utilisation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Coordonnées et Utilisation</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitude" className="text-gray-300">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange("latitude", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0.000000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude" className="text-gray-300">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange("longitude", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0.000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soilType" className="text-gray-300">Type de sol</Label>
                    <Select value={formData.soilType} onValueChange={(value) => handleInputChange("soilType", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner le type de sol" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {soilTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="irrigationSystem" className="text-gray-300">Système d'irrigation</Label>
                    <Select value={formData.irrigationSystem} onValueChange={(value) => handleInputChange("irrigationSystem", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner le système" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {irrigationSystems.map((system) => (
                          <SelectItem key={system} value={system} className="text-white hover:bg-gray-700">
                            {system}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentUse" className="text-gray-300">Utilisation actuelle</Label>
                    <Input
                      id="currentUse"
                      value={formData.currentUse}
                      onChange={(e) => handleInputChange("currentUse", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Pâturage pour bovins"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plannedUse" className="text-gray-300">Utilisation prévue</Label>
                    <Input
                      id="plannedUse"
                      value={formData.plannedUse}
                      onChange={(e) => handleInputChange("plannedUse", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Culture de blé"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Notes supplémentaires sur la zone..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="hover:bg-gray-700"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Créer la Zone
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
