"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { ArrowLeft, Save, Users } from "lucide-react"
import toast from "react-hot-toast"
import { Layout } from "@/lib/components/layout/layout"

interface PoultryFlock {
  id: number
  name: string
  breed: string
  age: number
  quantity: number
  location: string
  healthStatus: "healthy" | "sick" | "quarantine"
  feedingSchedule: string
  notes: string
  dateAdded: string
  expectedProduction: number
  vaccinationStatus: "up_to_date" | "pending" | "overdue"
}

export default function CreatePoultryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    quantity: "",
    location: "",
    healthStatus: "",
    feedingSchedule: "",
    notes: "",
    expectedProduction: "",
    vaccinationStatus: ""
  })

  const breeds = [
    "Poule pondeuse",
    "Poulet de chair",
    "Dinde",
    "Canard",
    "Oie",
    "Pintade",
    "Caille",
    "Autre"
  ]

  const healthStatuses = [
    { value: "healthy", label: "En bonne santé" },
    { value: "sick", label: "Malade" },
    { value: "quarantine", label: "En quarantaine" }
  ]

  const vaccinationStatuses = [
    { value: "up_to_date", label: "À jour" },
    { value: "pending", label: "En attente" },
    { value: "overdue", label: "En retard" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulation de création avec fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newFlock: PoultryFlock = {
        id: Date.now(),
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age),
        quantity: parseInt(formData.quantity),
        location: formData.location,
        healthStatus: formData.healthStatus as "healthy" | "sick" | "quarantine",
        feedingSchedule: formData.feedingSchedule,
        notes: formData.notes,
        dateAdded: new Date().toISOString(),
        expectedProduction: parseInt(formData.expectedProduction),
        vaccinationStatus: formData.vaccinationStatus as "up_to_date" | "pending" | "overdue"
      }

      // Récupérer les volailles existantes
      const existingPoultry = JSON.parse(localStorage.getItem("poultry") || "[]")
      existingPoultry.push(newFlock)
      localStorage.setItem("poultry", JSON.stringify(existingPoultry))

      toast.success("Troupeau de volailles créé avec succès !")
      router.push("/poultry")
    } catch (error) {
      toast.error("Erreur lors de la création du troupeau")
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
              <h1 className="text-3xl font-bold text-white">Nouveau Troupeau</h1>
              <p className="text-gray-400 mt-2">Ajouter un nouveau troupeau de volailles</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Informations du Troupeau
            </CardTitle>
            <CardDescription className="text-gray-400">
              Remplissez les informations pour créer un nouveau troupeau de volailles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informations de Base</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nom du troupeau *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Troupeau A - Poules pondeuses"
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
                      <Label htmlFor="age" className="text-gray-300">Âge (semaines) *</Label>
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
                      <Label htmlFor="quantity" className="text-gray-300">Nombre d'animaux *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Emplacement *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Poulailler 1, Zone A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedProduction" className="text-gray-300">Production attendue (œufs/jour)</Label>
                    <Input
                      id="expectedProduction"
                      type="number"
                      value={formData.expectedProduction}
                      onChange={(e) => handleInputChange("expectedProduction", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Santé et soins */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Santé et Soins</h3>
                  
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
                    <Label htmlFor="vaccinationStatus" className="text-gray-300">Statut de vaccination *</Label>
                    <Select value={formData.vaccinationStatus} onValueChange={(value) => handleInputChange("vaccinationStatus", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {vaccinationStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedingSchedule" className="text-gray-300">Programme d'alimentation</Label>
                    <Textarea
                      id="feedingSchedule"
                      value={formData.feedingSchedule}
                      onChange={(e) => handleInputChange("feedingSchedule", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: 3 fois par jour - 7h, 12h, 18h"
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
                      placeholder="Notes supplémentaires sur le troupeau..."
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
                  className="bg-orange-600 hover:bg-orange-700"
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
                      Créer le Troupeau
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
