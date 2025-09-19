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
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, MapPin } from "lucide-react"

export default function CreateZonePage() {
  const router = useRouter()
  const createZone = useCreateZone()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    area: "",
    status: "active",
    notes: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const zoneTypes = [
    { value: "cultivation", label: "Culture" },
    { value: "pasture", label: "Pâturage" },
    { value: "enclosure", label: "Enclos" },
    { value: "building", label: "Bâtiment" },
    { value: "water_point", label: "Point d'eau" },
    { value: "storage", label: "Stockage" },
    { value: "other", label: "Autre" }
  ]

  const statuses = [
    { value: "active", label: "Actif" },
    { value: "inactive", label: "Inactif" },
    { value: "maintenance", label: "Maintenance" }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Le nom de la zone est requis"
    if (!formData.type) newErrors.type = "Le type de zone est requis"
    if (formData.area && parseFloat(formData.area) < 0) {
      newErrors.area = "La superficie doit être positive"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire")
      return
    }

    try {
      await createZone.mutateAsync({
        name: formData.name,
        description: formData.description || null,
        type: formData.type,
        coordinates: {
          type: "Polygon",
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        },
        area: formData.area ? parseFloat(formData.area) : null,
        status: formData.status,
        notes: formData.notes || null
      })
      
      toast.success("Zone créée avec succès !")
      router.push("/zones")
    } catch (error: any) {
      toast.error(`Erreur lors de la création: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <LayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Nouvelle Zone</h1>
              <p className="text-gray-300 mt-2">
                Ajouter une nouvelle zone à votre exploitation
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Informations de la zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Nom de la zone */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la zone *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Poulailler Principal"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Type de zone */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type de zone *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
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
                  {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                </div>

                {/* Superficie */}
                <div className="space-y-2">
                  <Label htmlFor="area">Superficie (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="0.00"
                    className={errors.area ? "border-red-500" : ""}
                  />
                  {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Description détaillée de la zone..."
                    rows={3}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Notes supplémentaires sur la zone..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createZone.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createZone.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Créer la zone
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </LayoutSimple>
  )
}