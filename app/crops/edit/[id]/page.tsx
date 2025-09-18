"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { useUpdateCrop, useZones } from "@/lib/hooks/use-api-data"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, Wheat, Trash2 } from "lucide-react"

export default function EditCropPage() {
  const router = useRouter()
  const params = useParams()
  const updateCrop = useUpdateCrop()
  const { data: zonesData } = useZones()
  
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    zone_id: "",
    planting_date: "",
    expected_harvest_date: "",
    actual_harvest_date: "",
    planted_area: "",
    expected_yield: "",
    actual_yield: "",
    status: "planted",
    notes: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  const cropNames = [
    "Maïs", "Riz", "Tomates", "Oignons", "Haricots", "Arachides", "Manioc", "Igname", "Patate douce", "Légumes verts"
  ]

  const varieties = [
    "Hybride F1", "NERICA 4", "Roma", "Violet de Galmi", "Niébé", "Local", "Amélioré", "Traditionnel"
  ]

  const statuses = [
    { value: "planted", label: "Planté" },
    { value: "growing", label: "En croissance" },
    { value: "harvested", label: "Récolté" },
    { value: "failed", label: "Échec" }
  ]

  const zones = zonesData?.items || []

  // Charger les données de la culture
  useEffect(() => {
    const loadCropData = async () => {
      try {
        // Ici vous devriez charger les données depuis l'API
        // Pour l'instant, on simule avec des données
        const mockData = {
          name: "Maïs",
          variety: "Hybride F1",
          zone_id: "4",
          planting_date: "2024-03-15",
          expected_harvest_date: "2024-07-15",
          actual_harvest_date: "",
          planted_area: "2000.00",
          expected_yield: "8000.00",
          actual_yield: "",
          status: "growing",
          notes: "Maïs en phase de croissance"
        }
        
        setFormData(mockData)
        setIsLoading(false)
      } catch (error) {
        toast.error("Erreur lors du chargement de la culture")
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadCropData()
    }
  }, [params.id])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Le nom de la culture est requis"
    if (!formData.variety.trim()) newErrors.variety = "La variété est requise"
    if (!formData.zone_id) newErrors.zone_id = "La zone est requise"
    if (!formData.planting_date) newErrors.planting_date = "La date de plantation est requise"
    if (!formData.planted_area || parseFloat(formData.planted_area) <= 0) {
      newErrors.planted_area = "La superficie doit être positive"
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
      await updateCrop.mutateAsync({
        id: parseInt(params.id as string),
        data: {
          name: formData.name,
          variety: formData.variety,
          zone_id: parseInt(formData.zone_id),
          planting_date: formData.planting_date,
          expected_harvest_date: formData.expected_harvest_date || null,
          actual_harvest_date: formData.actual_harvest_date || null,
          planted_area: parseFloat(formData.planted_area),
          expected_yield: formData.expected_yield ? parseFloat(formData.expected_yield) : null,
          actual_yield: formData.actual_yield ? parseFloat(formData.actual_yield) : null,
          status: formData.status,
          notes: formData.notes || null
        }
      })
      
      toast.success("Culture modifiée avec succès !")
      router.push("/crops")
    } catch (error: any) {
      toast.error(`Erreur lors de la modification: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette culture ?")) {
      try {
        // Ici vous devriez appeler l'API de suppression
        toast.success("Culture supprimée avec succès !")
        router.push("/crops")
      } catch (error: any) {
        toast.error(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`)
      }
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-96 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
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
              <h1 className="text-3xl font-bold tracking-tight text-white">Modifier la Culture</h1>
              <p className="text-gray-300 mt-2">
                Modifier les informations de la culture
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wheat className="mr-2 h-5 w-5" />
              Informations de la culture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Nom de la culture */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la culture *</Label>
                  <Select value={formData.name} onValueChange={(value) => handleInputChange("name", value)}>
                    <SelectTrigger className={errors.name ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner une culture" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropNames.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Variété */}
                <div className="space-y-2">
                  <Label htmlFor="variety">Variété *</Label>
                  <Select value={formData.variety} onValueChange={(value) => handleInputChange("variety", value)}>
                    <SelectTrigger className={errors.variety ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner une variété" />
                    </SelectTrigger>
                    <SelectContent>
                      {varieties.map((variety) => (
                        <SelectItem key={variety} value={variety}>
                          {variety}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.variety && <p className="text-sm text-red-500">{errors.variety}</p>}
                </div>

                {/* Zone */}
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone de plantation *</Label>
                  <Select value={formData.zone_id} onValueChange={(value) => handleInputChange("zone_id", value)}>
                    <SelectTrigger className={errors.zone_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.zone_id && <p className="text-sm text-red-500">{errors.zone_id}</p>}
                </div>

                {/* Date de plantation */}
                <div className="space-y-2">
                  <Label htmlFor="planting_date">Date de plantation *</Label>
                  <Input
                    id="planting_date"
                    type="date"
                    value={formData.planting_date}
                    onChange={(e) => handleInputChange("planting_date", e.target.value)}
                    className={errors.planting_date ? "border-red-500" : ""}
                  />
                  {errors.planting_date && <p className="text-sm text-red-500">{errors.planting_date}</p>}
                </div>

                {/* Date de récolte prévue */}
                <div className="space-y-2">
                  <Label htmlFor="expected_harvest_date">Date de récolte prévue</Label>
                  <Input
                    id="expected_harvest_date"
                    type="date"
                    value={formData.expected_harvest_date}
                    onChange={(e) => handleInputChange("expected_harvest_date", e.target.value)}
                  />
                </div>

                {/* Date de récolte réelle */}
                <div className="space-y-2">
                  <Label htmlFor="actual_harvest_date">Date de récolte réelle</Label>
                  <Input
                    id="actual_harvest_date"
                    type="date"
                    value={formData.actual_harvest_date}
                    onChange={(e) => handleInputChange("actual_harvest_date", e.target.value)}
                  />
                </div>

                {/* Superficie plantée */}
                <div className="space-y-2">
                  <Label htmlFor="planted_area">Superficie plantée (m²) *</Label>
                  <Input
                    id="planted_area"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.planted_area}
                    onChange={(e) => handleInputChange("planted_area", e.target.value)}
                    placeholder="0.00"
                    className={errors.planted_area ? "border-red-500" : ""}
                  />
                  {errors.planted_area && <p className="text-sm text-red-500">{errors.planted_area}</p>}
                </div>

                {/* Rendement prévu */}
                <div className="space-y-2">
                  <Label htmlFor="expected_yield">Rendement prévu (kg)</Label>
                  <Input
                    id="expected_yield"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.expected_yield}
                    onChange={(e) => handleInputChange("expected_yield", e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Rendement réel */}
                <div className="space-y-2">
                  <Label htmlFor="actual_yield">Rendement réel (kg)</Label>
                  <Input
                    id="actual_yield"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.actual_yield}
                    onChange={(e) => handleInputChange("actual_yield", e.target.value)}
                    placeholder="0.00"
                  />
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

                {/* Notes */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Notes supplémentaires sur la culture..."
                    rows={3}
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
                  disabled={updateCrop.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updateCrop.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Modification...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
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
