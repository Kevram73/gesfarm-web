"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { useZones, useUpdateZone } from "@/lib/hooks/use-api-data"
import { ArrowLeft, Save, MapPin, Loader2, Navigation } from "lucide-react"
import { toast } from "sonner"

export default function EditZonePage() {
  const router = useRouter()
  const params = useParams()
  const zoneId = parseInt(params.id as string)
  
  const { data: zonesData, isLoading } = useZones({ per_page: 100 })
  const updateZoneMutation = useUpdateZone()
  
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

  // Charger les données de la zone
  useEffect(() => {
    if (zonesData?.data) {
      const zone = zonesData.data.find(z => z.id === zoneId)
      if (zone) {
        // Gérer les coordonnées - elles peuvent être un objet ou une chaîne JSON
        let coordinates = { type: "Point", coordinates: [0, 0] }
        if (zone.coordinates) {
          if (typeof zone.coordinates === 'string') {
            try {
              coordinates = JSON.parse(zone.coordinates)
            } catch (e) {
              console.error('Erreur parsing coordinates:', e)
            }
          } else if (typeof zone.coordinates === 'object') {
            coordinates = zone.coordinates
          }
        }

        setFormData({
          name: zone.name || "",
          description: zone.description || "",
          type: (zone.type as 'cultivation' | 'pasture' | 'enclosure' | 'building' | 'water_point') || "",
          area: zone.area?.toString() || "",
          coordinates: {
            type: (coordinates.type || "Point") as "Point",
            coordinates: (coordinates.coordinates || [0, 0]) as [number, number]
          },
          status: (zone.status as 'active' | 'inactive' | 'maintenance') || "active"
        })
      }
    }
  }, [zonesData, zoneId])

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
        ) as [number, number]
      }
    }))
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par ce navigateur")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData(prev => ({
          ...prev,
          coordinates: {
            ...prev.coordinates,
            coordinates: [longitude, latitude] as [number, number]
          }
        }))
        toast.success("Position GPS obtenue avec succès")
      },
      (error) => {
        console.error("Erreur géolocalisation:", error)
        toast.error("Impossible d'obtenir la position GPS")
      }
    )
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

    // Validation des coordonnées GPS
    const [longitude, latitude] = formData.coordinates.coordinates
    if (!longitude || !latitude) {
      newErrors.coordinates = "Les coordonnées GPS sont requises"
    } else {
      // Validation des plages de coordonnées
      if (latitude < -90 || latitude > 90) {
        newErrors.coordinates = "La latitude doit être entre -90 et 90"
      }
      if (longitude < -180 || longitude > 180) {
        newErrors.coordinates = "La longitude doit être entre -180 et 180"
      }
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
        name: formData.name,
        description: formData.description,
        type: formData.type as 'cultivation' | 'pasture' | 'enclosure' | 'building' | 'water_point',
        area: parseFloat(formData.area),
        coordinates: formData.coordinates,
        status: formData.status
      }

      await updateZoneMutation.mutateAsync({ id: zoneId, data: zoneData })
      toast.success("Zone mise à jour avec succès")
      router.push("/zones")
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast.error("Erreur lors de la mise à jour de la zone")
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    )
  }

  const zone = zonesData?.data?.find(z => z.id === zoneId)
  if (!zone) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Zone non trouvée</h1>
          <p className="text-gray-600 mt-2">La zone demandée n'existe pas.</p>
          <Button onClick={() => router.push("/zones")} className="mt-4">
            Retour aux zones
          </Button>
        </div>
      </Layout>
    )
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
              Modifier la zone
            </h1>
            <p className="text-gray-600 mt-2">
              Modifier les informations de la zone "{zone.name}".
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
                <div className="flex items-center justify-between">
                  <Label>Coordonnées GPS *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    className="flex items-center space-x-1"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Ma position</span>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      min="-90"
                      max="90"
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
                      min="-180"
                      max="180"
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
                  disabled={updateZoneMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateZoneMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}