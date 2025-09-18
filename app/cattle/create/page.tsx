"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { useCreateCattle, useZones } from "@/lib/hooks/use-api-data"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, Milk } from "lucide-react"

export default function CreateCattlePage() {
  const router = useRouter()
  const createCattle = useCreateCattle()
  const { data: zonesData } = useZones()
  
  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    gender: "",
    birth_date: "",
    mother_tag: "",
    father_tag: "",
    current_weight: "",
    status: "active",
    zone_id: "",
    notes: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const breeds = [
    "Holstein", "Jersey", "Angus", "Charolais", "Limousin", "Simmental", "Local", "Crossbreed"
  ]

  const genders = [
    { value: "male", label: "Mâle" },
    { value: "female", label: "Femelle" }
  ]

  const statuses = [
    { value: "active", label: "Actif" },
    { value: "sold", label: "Vendu" },
    { value: "deceased", label: "Décédé" }
  ]

  const zones = zonesData?.items || []

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.tag_number.trim()) newErrors.tag_number = "Le numéro d'étiquette est requis"
    if (!formData.breed.trim()) newErrors.breed = "La race est requise"
    if (!formData.gender) newErrors.gender = "Le sexe est requis"
    if (!formData.birth_date) newErrors.birth_date = "La date de naissance est requise"
    if (formData.current_weight && parseFloat(formData.current_weight) < 0) {
      newErrors.current_weight = "Le poids doit être positif"
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
      await createCattle.mutateAsync({
        tag_number: formData.tag_number,
        name: formData.name || null,
        breed: formData.breed,
        gender: formData.gender,
        birth_date: formData.birth_date,
        mother_tag: formData.mother_tag || null,
        father_tag: formData.father_tag || null,
        current_weight: formData.current_weight ? parseFloat(formData.current_weight) : null,
        status: formData.status,
        zone_id: formData.zone_id ? parseInt(formData.zone_id) : null,
        notes: formData.notes || null
      })
      
      toast.success("Bovin ajouté avec succès !")
      router.push("/cattle")
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
              <h1 className="text-3xl font-bold tracking-tight text-white">Nouveau Bovin</h1>
              <p className="text-gray-300 mt-2">
                Ajouter un nouveau bovin à votre troupeau
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Milk className="mr-2 h-5 w-5" />
              Informations du bovin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Numéro d'étiquette */}
                <div className="space-y-2">
                  <Label htmlFor="tag_number">Numéro d'étiquette *</Label>
                  <Input
                    id="tag_number"
                    value={formData.tag_number}
                    onChange={(e) => handleInputChange("tag_number", e.target.value)}
                    placeholder="Ex: BOV-001"
                    className={errors.tag_number ? "border-red-500" : ""}
                  />
                  {errors.tag_number && <p className="text-sm text-red-500">{errors.tag_number}</p>}
                </div>

                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom (optionnel)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Bella"
                  />
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

                {/* Sexe */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexe *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner le sexe" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>

                {/* Date de naissance */}
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Date de naissance *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange("birth_date", e.target.value)}
                    className={errors.birth_date ? "border-red-500" : ""}
                  />
                  {errors.birth_date && <p className="text-sm text-red-500">{errors.birth_date}</p>}
                </div>

                {/* Poids actuel */}
                <div className="space-y-2">
                  <Label htmlFor="current_weight">Poids actuel (kg)</Label>
                  <Input
                    id="current_weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.current_weight}
                    onChange={(e) => handleInputChange("current_weight", e.target.value)}
                    placeholder="0.0"
                    className={errors.current_weight ? "border-red-500" : ""}
                  />
                  {errors.current_weight && <p className="text-sm text-red-500">{errors.current_weight}</p>}
                </div>

                {/* Étiquette mère */}
                <div className="space-y-2">
                  <Label htmlFor="mother_tag">Étiquette mère</Label>
                  <Input
                    id="mother_tag"
                    value={formData.mother_tag}
                    onChange={(e) => handleInputChange("mother_tag", e.target.value)}
                    placeholder="Ex: BOV-050"
                  />
                </div>

                {/* Étiquette père */}
                <div className="space-y-2">
                  <Label htmlFor="father_tag">Étiquette père</Label>
                  <Input
                    id="father_tag"
                    value={formData.father_tag}
                    onChange={(e) => handleInputChange("father_tag", e.target.value)}
                    placeholder="Ex: BOV-025"
                  />
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
                    placeholder="Notes supplémentaires sur l'animal..."
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
                  disabled={createCattle.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createCattle.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Ajouter le bovin
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