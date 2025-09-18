"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { useCreateZone } from "@/lib/hooks/use-api-data"
import { ArrowLeft, Save, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function AddZonePage() {
  const router = useRouter()
  const createZoneMutation = useCreateZone()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "" as 'cultivation' | 'pasture' | 'enclosure' | 'building' | 'water_point' | '',
    area: "",
    coordinates: {
      type: "Point" as const,
      coordinates: [0, 0] as [number, number]
    },
    status: "active" as 'active' | 'inactive' | 'maintenance'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const zoneTypes = [
    { value: "cultivation", label: "Culture" },
    { value: "pasture", label: "Pâturage" },
    { value: "enclosure", label: "Enclos" },
    { value: "building", label: "Bâtiment" },
    { value: "water_point", label: "Point d'eau" }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const handleCoordinateChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        coordinates: prev.coordinates.coordinates.map((coord, i) => 
          i === index ? numValue : coord
        )
      }
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la zone est requis"
    }

    if (!formData.type) {
      newErrors.type = "Le type de zone est requis"
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      newErrors.area = "La surface doit être un nombre positif"
    }

    if (!formData.coordinates.coordinates[0] || !formData.coordinates.coordinates[1]) {
      newErrors.coordinates = "Les coordonnées sont requises"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const zoneData = {
        ...formData,
        area: parseFloat(formData.area)
      }

      await createZoneMutation.mutateAsync(zoneData)
      toast.success("Zone créée avec succès")
      router.push("/zones")
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast.error("Erreur lors de la création de la zone")
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Nouvelle Zone
            </h1>
            <p className="text-gray-600 mt-2">
              Créer une nouvelle zone dans votre exploitation.
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Informations de la zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la zone *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Poulailler Nord"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type de zone *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {zoneTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600">{errors.type}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Description de la zone..."
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Surface */}
                <div className="space-y-2">
                  <Label htmlFor="area">Surface (m²) *</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="Ex: 200.50"
                    className={errors.area ? "border-red-500" : ""}
                  />
                  {errors.area && (
                    <p className="text-sm text-red-600">{errors.area}</p>
                  )}
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Coordonnées */}
              <div className="space-y-2">
                <Label>Coordonnées GPS *</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.coordinates.coordinates[1] || ""}
                      onChange={(e) => handleCoordinateChange(1, e.target.value)}
                      placeholder="Ex: 48.8566"
                      className={errors.coordinates ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.coordinates.coordinates[0] || ""}
                      onChange={(e) => handleCoordinateChange(0, e.target.value)}
                      placeholder="Ex: 2.3522"
                      className={errors.coordinates ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                {errors.coordinates && (
                  <p className="text-sm text-red-600">{errors.coordinates}</p>
                )}
                <p className="text-xs text-gray-500">
                  Vous pouvez obtenir les coordonnées GPS depuis Google Maps ou un GPS.
                </p>
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createZoneMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createZoneMutation.isPending ? "Création..." : "Créer la zone"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
