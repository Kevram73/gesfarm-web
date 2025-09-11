"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { ArrowLeft, Save, Package, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { Layout } from "@/lib/components/layout/layout"

interface StockItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  minThreshold: number
  maxThreshold: number
  cost: number
  supplier: string
  description: string
  location: string
  expiryDate?: string
  status: "available" | "low_stock" | "out_of_stock"
}

export default function EditStockPage() {
  const router = useRouter()
  const params = useParams()
  const stockId = parseInt(params.id as string)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [stock, setStock] = useState<StockItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    minThreshold: "",
    maxThreshold: "",
    cost: "",
    supplier: "",
    description: "",
    location: "",
    expiryDate: ""
  })

  const categories = [
    "Aliments",
    "Médicaments",
    "Équipements",
    "Semences",
    "Engrais",
    "Outils",
    "Matériel",
    "Autres"
  ]

  const units = [
    "kg",
    "g",
    "L",
    "mL",
    "pièces",
    "sacs",
    "bouteilles",
    "boîtes",
    "mètres",
    "m²"
  ]

  useEffect(() => {
    // Charger les données du stock
    const stocks = JSON.parse(localStorage.getItem("stocks") || "[]")
    const foundStock = stocks.find((s: StockItem) => s.id === stockId)
    
    if (foundStock) {
      setStock(foundStock)
      setFormData({
        name: foundStock.name,
        category: foundStock.category,
        quantity: foundStock.quantity.toString(),
        unit: foundStock.unit,
        minThreshold: foundStock.minThreshold.toString(),
        maxThreshold: foundStock.maxThreshold.toString(),
        cost: foundStock.cost.toString(),
        supplier: foundStock.supplier,
        description: foundStock.description,
        location: foundStock.location,
        expiryDate: foundStock.expiryDate || ""
      })
    } else {
      toast.error("Stock non trouvé")
      router.push("/stocks")
    }
    setIsLoading(false)
  }, [stockId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedStock: StockItem = {
        ...stock!,
        name: formData.name,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        minThreshold: parseFloat(formData.minThreshold),
        maxThreshold: parseFloat(formData.maxThreshold),
        cost: parseFloat(formData.cost),
        supplier: formData.supplier,
        description: formData.description,
        location: formData.location,
        expiryDate: formData.expiryDate || undefined,
        status: parseFloat(formData.quantity) <= parseFloat(formData.minThreshold) ? "low_stock" : "available"
      }

      // Mettre à jour les stocks
      const stocks = JSON.parse(localStorage.getItem("stocks") || "[]")
      const updatedStocks = stocks.map((s: StockItem) => 
        s.id === stockId ? updatedStock : s
      )
      localStorage.setItem("stocks", JSON.stringify(updatedStocks))

      toast.success("Stock mis à jour avec succès !")
      router.push("/stocks")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du stock")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce stock ?")) return

    try {
      const stocks = JSON.parse(localStorage.getItem("stocks") || "[]")
      const updatedStocks = stocks.filter((s: StockItem) => s.id !== stockId)
      localStorage.setItem("stocks", JSON.stringify(updatedStocks))

      toast.success("Stock supprimé avec succès !")
      router.push("/stocks")
    } catch (error) {
      toast.error("Erreur lors de la suppression du stock")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </Layout>
    )
  }

  if (!stock) {
    return null
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
              <h1 className="text-3xl font-bold text-white">Modifier le Stock</h1>
              <p className="text-gray-400 mt-2">Modifier les informations de {stock.name}</p>
            </div>
          </div>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>

        {/* Formulaire */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Informations du Stock
            </CardTitle>
            <CardDescription className="text-gray-400">
              Modifiez les informations de cet article de stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informations de Base</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nom de l'article *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Aliment pour poulets"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-300">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Description détaillée de l'article..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Emplacement *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Entrepôt A, Étagère 3"
                      required
                    />
                  </div>
                </div>

                {/* Quantité et seuils */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Quantité et Seuils</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-gray-300">Quantité actuelle *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-gray-300">Unité *</Label>
                      <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Unité" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit} className="text-white hover:bg-gray-700">
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="minThreshold" className="text-gray-300">Seuil minimum *</Label>
                      <Input
                        id="minThreshold"
                        type="number"
                        step="0.01"
                        value={formData.minThreshold}
                        onChange={(e) => handleInputChange("minThreshold", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxThreshold" className="text-gray-300">Seuil maximum</Label>
                      <Input
                        id="maxThreshold"
                        type="number"
                        step="0.01"
                        value={formData.maxThreshold}
                        onChange={(e) => handleInputChange("maxThreshold", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost" className="text-gray-300">Coût unitaire (€)</Label>
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
                    <Label htmlFor="supplier" className="text-gray-300">Fournisseur</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange("supplier", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Nom du fournisseur"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-gray-300">Date d'expiration</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
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
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sauvegarde...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
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
