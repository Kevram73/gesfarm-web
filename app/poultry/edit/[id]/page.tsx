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
import { useUpdatePoultryFlock, useZones } from "@/lib/hooks/use-api-data"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, Egg, Trash2 } from "lucide-react"

export default function EditPoultryFlockPage() {
  const router = useRouter()
  const params = useParams()
  const updatePoultryFlock = useUpdatePoultryFlock()
  const { data: zonesData } = useZones()
  
  const [formData, setFormData] = useState({
    flock_number: "",
    type: "",
    breed: "",
    initial_quantity: "",
    current_quantity: "",
    arrival_date: "",
    age_days: "",
    zone_id: "",
    status: "active",
    notes: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  const poultryTypes = [
    { value: "layer", label: "Pondeuse" },
    { value: "broiler", label: "Poulet de chair" },
    { value: "duck", label: "Canard" },
    { value: "turkey", label: "Dinde" }
  ]

  const breeds = [
    "Isa Brown", "Leghorn", "Cobb 500", "Ross 308", "Hubbard", "Hybrid", "Local"
  ]

  const statuses = [
    { value: "active", label: "Actif" },
    { value: "inactive", label: "Inactif" },
    { value: "sold", label: "Vendu" }
  ]

  const zones = zonesData?.items || []

  // Charger les données du lot
  useEffect(() => {
    const loadFlockData = async () => {
      try {
        // Ici vous devriez charger les données depuis l'API
        // Pour l'instant, on simule avec des données
        const mockData = {
          flock_number: "FLK-2024-001",
          type: "layer",
          breed: "Isa Brown",
          initial_quantity: "500",
          current_quantity: "485",
          arrival_date: "2024-01-15",
          age_days: "120",
          zone_id: "1",
          status: "active",
          notes: "Poules pondeuses en production"
        }
        
        setFormData(mockData)
        setIsLoading(false)
      } catch (error) {
        toast.error("Erreur lors du chargement du lot")
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadFlockData()
    }
  }, [params.id])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.flock_number.trim()) newErrors.flock_number = "Le numéro de lot est requis"
    if (!formData.type) newErrors.type = "Le type est requis"
    if (!formData.breed.trim()) newErrors.breed = "La race est requise"
    if (!formData.initial_quantity || parseInt(formData.initial_quantity) <= 0) {
      newErrors.initial_quantity = "La quantité initiale doit être positive"
    }
    if (!formData.current_quantity || parseInt(formData.current_quantity) < 0) {
      newErrors.current_quantity = "La quantité actuelle doit être positive"
    }
    if (!formData.arrival_date) newErrors.arrival_date = "La date d'arrivée est requise"
    if (!formData.age_days || parseInt(formData.age_days) < 0) {
      newErrors.age_days = "L'âge en jours doit être positif"
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
      await updatePoultryFlock.mutateAsync({
        id: parseInt(params.id as string),
        data: {
          flock_number: formData.flock_number,
          type: formData.type,
          breed: formData.breed,
          initial_quantity: parseInt(formData.initial_quantity),
          current_quantity: parseInt(formData.current_quantity),
          arrival_date: formData.arrival_date,
          age_days: parseInt(formData.age_days),
          zone_id: formData.zone_id ? parseInt(formData.zone_id) : null,
          status: formData.status,
          notes: formData.notes || null
        }
      })
      
      toast.success("Lot de volailles modifié avec succès !")
      router.push("/poultry")
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
    if (confirm("Êtes-vous sûr de vouloir supprimer ce lot de volailles ?")) {
      try {
        // Ici vous devriez appeler l'API de suppression
        toast.success("Lot supprimé avec succès !")
        router.push("/poultry")
      } catch (error: any) {
        toast.error(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`)
      }
    }
  }

  if (isLoading) {
    return (
      <LayoutSimple>
        <div className="space-y-6">
          <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-96 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </LayoutSimple>
    )
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
              <h1 className="text-3xl font-bold tracking-tight text-white">Modifier le Lot</h1>
              <p className="text-gray-300 mt-2">
                Modifier les informations du lot de volailles
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
              <Egg className="mr-2 h-5 w-5" />
              Informations du lot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Numéro de lot */}
                <div className="space-y-2">
                  <Label htmlFor="flock_number">Numéro de lot *</Label>
                  <Input
                    id="flock_number"
                    value={formData.flock_number}
                    onChange={(e) => handleInputChange("flock_number", e.target.value)}
                    placeholder="Ex: FLK-2024-001"
                    className={errors.flock_number ? "border-red-500" : ""}
                  />
                  {errors.flock_number && <p className="text-sm text-red-500">{errors.flock_number}</p>}
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {poultryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                </div>

                {/* Race */}
                <div className="space-y-2">
                  <Label htmlFor="breed">Race *</Label>
                  <Select value={formData.breed} onValueChange={(value) => handleInputChange("breed", value)}>
                    <SelectTrigger className={errors.breed ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner une race" />
                    </SelectTrigger>
                    <SelectContent>
                      {breeds.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.breed && <p className="text-sm text-red-500">{errors.breed}</p>}
                </div>

                {/* Zone */}
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone d'élevage</Label>
                  <Select value={formData.zone_id} onValueChange={(value) => handleInputChange("zone_id", value)}>
                    <SelectTrigger>
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
                </div>

                {/* Quantité initiale */}
                <div className="space-y-2">
                  <Label htmlFor="initial_quantity">Quantité initiale *</Label>
                  <Input
                    id="initial_quantity"
                    type="number"
                    min="1"
                    value={formData.initial_quantity}
                    onChange={(e) => handleInputChange("initial_quantity", e.target.value)}
                    placeholder="0"
                    className={errors.initial_quantity ? "border-red-500" : ""}
                  />
                  {errors.initial_quantity && <p className="text-sm text-red-500">{errors.initial_quantity}</p>}
                </div>

                {/* Quantité actuelle */}
                <div className="space-y-2">
                  <Label htmlFor="current_quantity">Quantité actuelle *</Label>
                  <Input
                    id="current_quantity"
                    type="number"
                    min="0"
                    value={formData.current_quantity}
                    onChange={(e) => handleInputChange("current_quantity", e.target.value)}
                    placeholder="0"
                    className={errors.current_quantity ? "border-red-500" : ""}
                  />
                  {errors.current_quantity && <p className="text-sm text-red-500">{errors.current_quantity}</p>}
                </div>

                {/* Date d'arrivée */}
                <div className="space-y-2">
                  <Label htmlFor="arrival_date">Date d'arrivée *</Label>
                  <Input
                    id="arrival_date"
                    type="date"
                    value={formData.arrival_date}
                    onChange={(e) => handleInputChange("arrival_date", e.target.value)}
                    className={errors.arrival_date ? "border-red-500" : ""}
                  />
                  {errors.arrival_date && <p className="text-sm text-red-500">{errors.arrival_date}</p>}
                </div>

                {/* Âge en jours */}
                <div className="space-y-2">
                  <Label htmlFor="age_days">Âge en jours *</Label>
                  <Input
                    id="age_days"
                    type="number"
                    min="0"
                    value={formData.age_days}
                    onChange={(e) => handleInputChange("age_days", e.target.value)}
                    placeholder="0"
                    className={errors.age_days ? "border-red-500" : ""}
                  />
                  {errors.age_days && <p className="text-sm text-red-500">{errors.age_days}</p>}
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
                    placeholder="Notes supplémentaires sur le lot..."
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
                  disabled={updatePoultryFlock.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updatePoultryFlock.isPending ? (
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
    </LayoutSimple>
  )
}
