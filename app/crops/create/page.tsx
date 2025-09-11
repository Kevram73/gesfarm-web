"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { ArrowLeft, Save, Wheat } from "lucide-react"
import toast from "react-hot-toast"
import { Layout } from "@/lib/components/layout/layout"

interface Crop {
  id: number
  name: string
  type: string
  variety: string
  area: number
  plantingDate: string
  expectedHarvestDate: string
  location: string
  status: "planted" | "growing" | "ready_for_harvest" | "harvested"
  soilType: string
  irrigationMethod: string
  fertilizerUsed: string
  notes: string
  expectedYield: number
  actualYield?: number
  cost: number
}

export default function CreateCropPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    variety: "",
    area: "",
    plantingDate: "",
    expectedHarvestDate: "",
    location: "",
    status: "",
    soilType: "",
    irrigationMethod: "",
    fertilizerUsed: "",
    notes: "",
    expectedYield: "",
    cost: ""
  })

  const cropTypes = [
    "Céréales",
    "Légumes",
    "Fruits",
    "Herbes aromatiques",
    "Plantes fourragères",
    "Cultures industrielles",
    "Autre"
  ]

  const soilTypes = [
    "Argileux",
    "Sableux",
    "Limoneux",
    "Calcaire",
    "Acide",
    "Neutre",
    "Autre"
  ]

  const irrigationMethods = [
    "Pluie naturelle",
    "Arrosage manuel",
    "Système d'irrigation goutte à goutte",
    "Aspersion",
    "Inondation",
    "Autre"
  ]

  const statuses = [
    { value: "planted", label: "Planté" },
    { value: "growing", label: "En croissance" },
    { value: "ready_for_harvest", label: "Prêt pour la récolte" },
    { value: "harvested", label: "Récolté" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulation de création avec fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCrop: Crop = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        variety: formData.variety,
        area: parseFloat(formData.area),
        plantingDate: formData.plantingDate,
        expectedHarvestDate: formData.expectedHarvestDate,
        location: formData.location,
        status: formData.status as "planted" | "growing" | "ready_for_harvest" | "harvested",
        soilType: formData.soilType,
        irrigationMethod: formData.irrigationMethod,
        fertilizerUsed: formData.fertilizerUsed,
        notes: formData.notes,
        expectedYield: parseFloat(formData.expectedYield),
        cost: parseFloat(formData.cost)
      }

      // Récupérer les cultures existantes
      const existingCrops = JSON.parse(localStorage.getItem("crops") || "[]")
      existingCrops.push(newCrop)
      localStorage.setItem("crops", JSON.stringify(existingCrops))

      toast.success("Culture créée avec succès !")
      router.push("/crops")
    } catch (error) {
      toast.error("Erreur lors de la création de la culture")
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
              <h1 className="text-3xl font-bold text-white">Nouvelle Culture</h1>
              <p className="text-gray-400 mt-2">Ajouter une nouvelle culture à l'exploitation</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wheat className="w-5 h-5 mr-2" />
              Informations de la Culture
            </CardTitle>
            <CardDescription className="text-gray-400">
              Remplissez les informations pour créer une nouvelle culture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informations de Base</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nom de la culture *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Blé d'hiver - Parcelle A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-gray-300">Type de culture *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {cropTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variety" className="text-gray-300">Variété *</Label>
                    <Input
                      id="variety"
                      value={formData.variety}
                      onChange={(e) => handleInputChange("variety", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Blé tendre d'hiver"
                      required
                    />
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
                    <Label htmlFor="location" className="text-gray-300">Emplacement *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Parcelle A, Zone Nord"
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
                </div>

                {/* Dates et rendement */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Dates et Rendement</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plantingDate" className="text-gray-300">Date de plantation *</Label>
                    <Input
                      id="plantingDate"
                      type="date"
                      value={formData.plantingDate}
                      onChange={(e) => handleInputChange("plantingDate", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedHarvestDate" className="text-gray-300">Date de récolte prévue *</Label>
                    <Input
                      id="expectedHarvestDate"
                      type="date"
                      value={formData.expectedHarvestDate}
                      onChange={(e) => handleInputChange("expectedHarvestDate", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedYield" className="text-gray-300">Rendement attendu (tonnes/ha)</Label>
                    <Input
                      id="expectedYield"
                      type="number"
                      step="0.1"
                      value={formData.expectedYield}
                      onChange={(e) => handleInputChange("expectedYield", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="0.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost" className="text-gray-300">Coût total (€)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => handleInputChange("cost", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="0.00"
                    />
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
                    <Label htmlFor="irrigationMethod" className="text-gray-300">Méthode d'irrigation</Label>
                    <Select value={formData.irrigationMethod} onValueChange={(value) => handleInputChange("irrigationMethod", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner la méthode" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {irrigationMethods.map((method) => (
                          <SelectItem key={method} value={method} className="text-white hover:bg-gray-700">
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fertilizerUsed" className="text-gray-300">Engrais utilisé</Label>
                    <Input
                      id="fertilizerUsed"
                      value={formData.fertilizerUsed}
                      onChange={(e) => handleInputChange("fertilizerUsed", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: NPK 15-15-15"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Notes supplémentaires sur la culture..."
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
                  className="bg-green-600 hover:bg-green-700"
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
                      Créer la Culture
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
