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
import { useUpdateStockItem } from "@/lib/hooks/use-api-data"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, Package, Trash2 } from "lucide-react"

export default function EditStockItemPage() {
  const router = useRouter()
  const params = useParams()
  const updateStockItem = useUpdateStockItem()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    category_id: "",
    unit: "",
    current_quantity: "",
    minimum_quantity: "",
    unit_cost: "",
    expiry_date: "",
    supplier: "",
    notes: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  const stockCategories = [
    { id: 1, name: "Aliments pour Volailles", type: "animal_feed" },
    { id: 2, name: "Aliments pour Bovins", type: "animal_feed" },
    { id: 3, name: "Engrais", type: "agricultural_inputs" },
    { id: 4, name: "Semences", type: "agricultural_inputs" },
    { id: 5, name: "Produits Vétérinaires", type: "veterinary_products" },
    { id: 6, name: "Équipements", type: "equipment" },
    { id: 7, name: "Matériel d'Élevage", type: "equipment" }
  ]

  const units = [
    "kg", "g", "L", "ml", "unité", "paquet", "carton", "sac", "bouteille", "dose"
  ]

  // Charger les données de l'article
  useEffect(() => {
    const loadStockItem = async () => {
      try {
        // Ici vous devriez charger les données depuis l'API
        // Pour l'instant, on simule avec des données
        const mockData = {
          name: "Aliment Pondeuses Premium",
          description: "Aliment complet pour poules pondeuses",
          sku: "ALM-PON-001",
          category_id: "1",
          unit: "kg",
          current_quantity: "2500.00",
          minimum_quantity: "500.00",
          unit_cost: "450.00",
          expiry_date: "2024-12-31",
          supplier: "AgroFeed Côte d'Ivoire",
          notes: "Stock suffisant pour 2 mois"
        }
        
        setFormData(mockData)
        setIsLoading(false)
      } catch (error) {
        toast.error("Erreur lors du chargement de l'article")
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadStockItem()
    }
  }, [params.id])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Le nom est requis"
    if (!formData.sku.trim()) newErrors.sku = "Le SKU est requis"
    if (!formData.category_id) newErrors.category_id = "La catégorie est requise"
    if (!formData.unit) newErrors.unit = "L'unité est requise"
    if (!formData.current_quantity || parseFloat(formData.current_quantity) < 0) {
      newErrors.current_quantity = "La quantité actuelle doit être positive"
    }
    if (!formData.minimum_quantity || parseFloat(formData.minimum_quantity) < 0) {
      newErrors.minimum_quantity = "La quantité minimum doit être positive"
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
      await updateStockItem.mutateAsync({
        id: parseInt(params.id as string),
        data: {
          name: formData.name,
          description: formData.description || null,
          sku: formData.sku,
          category_id: parseInt(formData.category_id),
          unit: formData.unit,
          current_quantity: parseFloat(formData.current_quantity),
          minimum_quantity: parseFloat(formData.minimum_quantity),
          unit_cost: formData.unit_cost ? parseFloat(formData.unit_cost) : null,
          expiry_date: formData.expiry_date || null,
          supplier: formData.supplier || null,
          notes: formData.notes || null
        }
      })
      
      toast.success("Article de stock modifié avec succès !")
      router.push("/stocks")
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
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        // Ici vous devriez appeler l'API de suppression
        toast.success("Article supprimé avec succès !")
        router.push("/stocks")
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
              <h1 className="text-3xl font-bold tracking-tight text-white">Modifier l'Article</h1>
              <p className="text-gray-300 mt-2">
                Modifier les informations de l'article de stock
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
              <Package className="mr-2 h-5 w-5" />
              Informations de l'article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'article *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Aliment Pondeuses Premium"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* SKU */}
                <div className="space-y-2">
                  <Label htmlFor="sku">Code SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Ex: ALM-PON-001"
                    className={errors.sku ? "border-red-500" : ""}
                  />
                  {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                    <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                </div>

                {/* Unité */}
                <div className="space-y-2">
                  <Label htmlFor="unit">Unité *</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger className={errors.unit ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner une unité" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
                </div>

                {/* Quantité actuelle */}
                <div className="space-y-2">
                  <Label htmlFor="current_quantity">Quantité actuelle *</Label>
                  <Input
                    id="current_quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.current_quantity}
                    onChange={(e) => handleInputChange("current_quantity", e.target.value)}
                    placeholder="0.00"
                    className={errors.current_quantity ? "border-red-500" : ""}
                  />
                  {errors.current_quantity && <p className="text-sm text-red-500">{errors.current_quantity}</p>}
                </div>

                {/* Quantité minimum */}
                <div className="space-y-2">
                  <Label htmlFor="minimum_quantity">Quantité minimum *</Label>
                  <Input
                    id="minimum_quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimum_quantity}
                    onChange={(e) => handleInputChange("minimum_quantity", e.target.value)}
                    placeholder="0.00"
                    className={errors.minimum_quantity ? "border-red-500" : ""}
                  />
                  {errors.minimum_quantity && <p className="text-sm text-red-500">{errors.minimum_quantity}</p>}
                </div>

                {/* Prix unitaire */}
                <div className="space-y-2">
                  <Label htmlFor="unit_cost">Prix unitaire (FCFA)</Label>
                  <Input
                    id="unit_cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_cost}
                    onChange={(e) => handleInputChange("unit_cost", e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Date d'expiration */}
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Date d'expiration</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => handleInputChange("expiry_date", e.target.value)}
                  />
                </div>

                {/* Fournisseur */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="supplier">Fournisseur</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange("supplier", e.target.value)}
                    placeholder="Ex: AgroFeed Côte d'Ivoire"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Description détaillée de l'article..."
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
                    placeholder="Notes supplémentaires..."
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
                  disabled={updateStockItem.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updateStockItem.isPending ? (
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