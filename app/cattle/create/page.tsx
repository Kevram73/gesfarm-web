"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { ArrowLeft, Save, Cow } from "lucide-react"
import toast from "react-hot-toast"
import { Layout } from "@/lib/components/layout/layout"

interface Cattle {
  id: number
  name: string
  breed: string
  age: number
  weight: number
  gender: "male" | "female"
  location: string
  healthStatus: "healthy" | "sick" | "pregnant" | "quarantine"
  feedingSchedule: string
  notes: string
  dateAdded: string
  lastVaccination: string
  nextVaccination: string
  milkProduction?: number
  pregnancyStatus?: "pregnant" | "not_pregnant" | "unknown"
  expectedCalving?: string
}

export default function CreateCattlePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    location: "",
    healthStatus: "",
    feedingSchedule: "",
    notes: "",
    lastVaccination: "",
    nextVaccination: "",
    milkProduction: "",
    pregnancyStatus: "",
    expectedCalving: ""
  })

  const breeds = [
    "Holstein",
    "Charolaise",
    "Limousine",
    "Blonde d'Aquitaine",
    "Salers",
    "Aubrac",
    "Gasconne",
    "Parthenaise",
    "Autre"
  ]

  const healthStatuses = [
    { value: "healthy", label: "En bonne santé" },
    { value: "sick", label: "Malade" },
    { value: "pregnant", label: "Gestante" },
    { value: "quarantine", label: "En quarantaine" }
  ]

  const pregnancyStatuses = [
    { value: "pregnant", label: "Gestante" },
    { value: "not_pregnant", label: "Non gestante" },
    { value: "unknown", label: "Inconnu" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulation de création avec fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCattle: Cattle = {
        id: Date.now(),
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        gender: formData.gender as "male" | "female",
        location: formData.location,
        healthStatus: formData.healthStatus as "healthy" | "sick" | "pregnant" | "quarantine",
        feedingSchedule: formData.feedingSchedule,
        notes: formData.notes,
        dateAdded: new Date().toISOString(),
        lastVaccination: formData.lastVaccination,
        nextVaccination: formData.nextVaccination,
        milkProduction: formData.milkProduction ? parseFloat(formData.milkProduction) : undefined,
        pregnancyStatus: formData.pregnancyStatus as "pregnant" | "not_pregnant" | "unknown",
        expectedCalving: formData.expectedCalving || undefined
      }

      // Récupérer les bovins existants
      const existingCattle = JSON.parse(localStorage.getItem("cattle") || "[]")
      existingCattle.push(newCattle)
      localStorage.setItem("cattle", JSON.stringify(existingCattle))

      toast.success("Bovin créé avec succès !")
      router.push("/cattle")
    } catch (error) {
      toast.error("Erreur lors de la création du bovin")
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
              <h1 className="text-3xl font-bold text-white">Nouveau Bovin</h1>
              <p className="text-gray-400 mt-2">Ajouter un nouveau bovin à l'élevage</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Cow className="w-5 h-5 mr-2" />
              Informations du Bovin
            </CardTitle>
            <CardDescription className="text-gray-400">
              Remplissez les informations pour créer un nouveau bovin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informations de Base</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nom/Numéro *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Bella-001 ou Vache-123"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed" className="text-gray-300">Race *</Label>
                    <Select value={formData.breed} onValueChange={(value) => handleInputChange("breed", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner une race" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {breeds.map((breed) => (
                          <SelectItem key={breed} value={breed} className="text-white hover:bg-gray-700">
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-gray-300">Âge (mois) *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-gray-300">Poids (kg) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0.0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-300">Sexe *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner le sexe" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="male" className="text-white hover:bg-gray-700">Mâle</SelectItem>
                        <SelectItem value="female" className="text-white hover:bg-gray-700">Femelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Emplacement *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Pâturage A, Étable 1"
                      required
                    />
                  </div>
                </div>

                {/* Santé et reproduction */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Santé et Reproduction</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="healthStatus" className="text-gray-300">État de santé *</Label>
                    <Select value={formData.healthStatus} onValueChange={(value) => handleInputChange("healthStatus", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner l'état de santé" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {healthStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pregnancyStatus" className="text-gray-300">Statut de gestation</Label>
                    <Select value={formData.pregnancyStatus} onValueChange={(value) => handleInputChange("pregnancyStatus", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {pregnancyStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedCalving" className="text-gray-300">Date de vêlage prévue</Label>
                    <Input
                      id="expectedCalving"
                      type="date"
                      value={formData.expectedCalving}
                      onChange={(e) => handleInputChange("expectedCalving", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="milkProduction" className="text-gray-300">Production laitière (L/jour)</Label>
                    <Input
                      id="milkProduction"
                      type="number"
                      step="0.1"
                      value={formData.milkProduction}
                      onChange={(e) => handleInputChange("milkProduction", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="0.0"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lastVaccination" className="text-gray-300">Dernière vaccination</Label>
                      <Input
                        id="lastVaccination"
                        type="date"
                        value={formData.lastVaccination}
                        onChange={(e) => handleInputChange("lastVaccination", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nextVaccination" className="text-gray-300">Prochaine vaccination</Label>
                      <Input
                        id="nextVaccination"
                        type="date"
                        value={formData.nextVaccination}
                        onChange={(e) => handleInputChange("nextVaccination", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedingSchedule" className="text-gray-300">Programme d'alimentation</Label>
                    <Textarea
                      id="feedingSchedule"
                      value={formData.feedingSchedule}
                      onChange={(e) => handleInputChange("feedingSchedule", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: 2 fois par jour - 6h et 18h"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Notes supplémentaires sur l'animal..."
                      rows={3}
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
                  className="bg-blue-600 hover:bg-blue-700"
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
                      Créer le Bovin
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
