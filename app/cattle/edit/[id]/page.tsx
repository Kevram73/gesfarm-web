"use client"

import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { useCattle, useUpdateCattle, useZones } from "@/lib/hooks/use-api-data"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useParams } from "next/navigation"

export default function EditCattlePage() {
  const router = useRouter()
  const params = useParams()
  const cattleId = params.id as string
  
  const { data: cattleData, isLoading } = useCattle({ per_page: 100 })
  const updateCattleMutation = useUpdateCattle()
  const { data: zonesData } = useZones()
  const zones = zonesData?.data || []

  const cattle = cattleData?.data?.find((c: any) => c.id.toString() === cattleId)

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

  // Populate form when cattle data is loaded
  useEffect(() => {
    if (cattle) {
      setFormData({
        tag_number: cattle.tag_number || "",
        name: cattle.name || "",
        breed: cattle.breed || "",
        gender: cattle.gender || "",
        birth_date: cattle.birth_date ? cattle.birth_date.split('T')[0] : "",
        mother_tag: cattle.mother_tag || "",
        father_tag: cattle.father_tag || "",
        current_weight: cattle.current_weight?.toString() || "",
        status: cattle.status || "active",
        zone_id: cattle.zone_id?.toString() || "",
        notes: cattle.notes || ""
      })
    }
  }, [cattle])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.tag_number.trim()) {
      newErrors.tag_number = "Le numéro d'identification est requis"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis"
    }

    if (!formData.breed.trim()) {
      newErrors.breed = "La race est requise"
    }

    if (!formData.gender) {
      newErrors.gender = "Le sexe est requis"
    }

    if (!formData.birth_date) {
      newErrors.birth_date = "La date de naissance est requise"
    }

    if (!formData.current_weight || parseFloat(formData.current_weight) <= 0) {
      newErrors.current_weight = "Le poids doit être supérieur à 0"
    }

    if (!formData.zone_id) {
      newErrors.zone_id = "La zone est requise"
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
      const cattleUpdateData = {
        ...formData,
        current_weight: parseFloat(formData.current_weight),
        zone_id: parseInt(formData.zone_id),
        mother_tag: formData.mother_tag || null,
        father_tag: formData.father_tag || null,
        notes: formData.notes || null
      }

      await updateCattleMutation.mutateAsync({ 
        id: parseInt(cattleId), 
        data: cattleUpdateData 
      })
      toast.success("Bovin modifié avec succès")
      router.push(`/cattle/details/${cattleId}`)
    } catch (error: any) {
      console.error("Error updating cattle:", error)
      toast.error(error.response?.data?.message || "Erreur lors de la modification du bovin")
    }
  }

  const handleCancel = () => {
    router.push(`/cattle/details/${cattleId}`)
  }

  if (isLoading) {
    return (
      <LayoutSimple>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </LayoutSimple>
    )
  }

  if (!cattle) {
    return (
      <LayoutSimple>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bovin non trouvé</h1>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">Le bovin demandé n'existe pas ou a été supprimé.</p>
            </CardContent>
          </Card>
        </div>
      </LayoutSimple>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Modifier {cattle.name}</h1>
              <p className="text-gray-600 mt-1">Modifier les informations de ce bovin</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tag_number">Numéro d'identification *</Label>
                  <Input
                    id="tag_number"
                    value={formData.tag_number}
                    onChange={(e) => handleInputChange("tag_number", e.target.value)}
                    placeholder="Ex: BOV-007"
                    className={errors.tag_number ? "border-red-500" : ""}
                  />
                  {errors.tag_number && (
                    <p className="text-sm text-red-500 mt-1">{errors.tag_number}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Luna"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="breed">Race *</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => handleInputChange("breed", e.target.value)}
                    placeholder="Ex: Holstein"
                    className={errors.breed ? "border-red-500" : ""}
                  />
                  {errors.breed && (
                    <p className="text-sm text-red-500 mt-1">{errors.breed}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="gender">Sexe *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner le sexe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Mâle</SelectItem>
                      <SelectItem value="female">Femelle</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="birth_date">Date de naissance *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange("birth_date", e.target.value)}
                    className={errors.birth_date ? "border-red-500" : ""}
                  />
                  {errors.birth_date && (
                    <p className="text-sm text-red-500 mt-1">{errors.birth_date}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informations physiques et localisation */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Physiques et Localisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current_weight">Poids actuel (kg) *</Label>
                  <Input
                    id="current_weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.current_weight}
                    onChange={(e) => handleInputChange("current_weight", e.target.value)}
                    placeholder="Ex: 450.5"
                    className={errors.current_weight ? "border-red-500" : ""}
                  />
                  {errors.current_weight && (
                    <p className="text-sm text-red-500 mt-1">{errors.current_weight}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mother_tag">Numéro de la mère</Label>
                  <Input
                    id="mother_tag"
                    value={formData.mother_tag}
                    onChange={(e) => handleInputChange("mother_tag", e.target.value)}
                    placeholder="Ex: BOV-001"
                  />
                </div>

                <div>
                  <Label htmlFor="father_tag">Numéro du père</Label>
                  <Input
                    id="father_tag"
                    value={formData.father_tag}
                    onChange={(e) => handleInputChange("father_tag", e.target.value)}
                    placeholder="Ex: BOV-002"
                  />
                </div>

                <div>
                  <Label htmlFor="zone_id">Zone *</Label>
                  <Select value={formData.zone_id} onValueChange={(value) => handleInputChange("zone_id", value)}>
                    <SelectTrigger className={errors.zone_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone: any) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.name} ({zone.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.zone_id && (
                    <p className="text-sm text-red-500 mt-1">{errors.zone_id}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="sold">Vendu</SelectItem>
                      <SelectItem value="deceased">Décédé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="notes">Notes et observations</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Ajoutez des notes sur ce bovin..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={updateCattleMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateCattleMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}