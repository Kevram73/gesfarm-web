"use client"

import { AuthGuard } from "@/lib/components/auth/auth-guard"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { useCreateFinancialTransaction, useFinancialCategories } from "@/lib/hooks/use-api-data"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, DollarSign } from "lucide-react"

export default function AddTransactionPage() {
  const router = useRouter()
  const createTransactionMutation = useCreateFinancialTransaction()
  const { data: categories } = useFinancialCategories()

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    subcategory: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    related_entity_type: '',
    related_entity_id: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        related_entity_id: formData.related_entity_id ? parseInt(formData.related_entity_id) : undefined
      }

      await createTransactionMutation.mutateAsync(transactionData)
      toast.success("Transaction créée avec succès")
      router.push("/financial")
    } catch (error: any) {
      console.error("Error creating transaction:", error)
      toast.error(error.response?.data?.message || "Erreur lors de la création de la transaction")
    }
  }

  const handleCancel = () => {
    router.push("/financial")
  }

  const incomeCategories = categories?.income_categories || [
    'Vente de produits',
    'Vente de bétail',
    'Vente de cultures',
    'Subventions',
    'Autres revenus'
  ]

  const expenseCategories = categories?.expense_categories || [
    'Alimentation',
    'Médecine vétérinaire',
    'Maintenance',
    'Équipement',
    'Personnel',
    'Transport',
    'Énergie',
    'Autres dépenses'
  ]

  return (
    <AuthGuard>
      <LayoutSimple>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.back()}
                  className="border-gray-200 hover:border-gray-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </div>
              <h1 className="text-3xl font-light text-gray-900">Nouvelle Transaction</h1>
              <p className="text-gray-500 mt-2">
                Enregistrer une nouvelle transaction financière
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Type de Transaction */}
                <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Type de Transaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Revenu</SelectItem>
                          <SelectItem value="expense">Dépense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Catégorie *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner la catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subcategory">Sous-catégorie</Label>
                      <Input
                        id="subcategory"
                        value={formData.subcategory}
                        onChange={(e) => handleInputChange('subcategory', e.target.value)}
                        placeholder="Ex: Vente de lait, Achat de fourrage..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Montant et Date */}
                <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">
                      Montant et Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Montant (FCFA) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="0.00"
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="reference">Référence</Label>
                      <Input
                        id="reference"
                        value={formData.reference}
                        onChange={(e) => handleInputChange('reference', e.target.value)}
                        placeholder="Ex: Facture #123, Chèque #456..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez cette transaction..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Relation avec une entité (optionnel) */}
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Relation avec une Entité (Optionnel)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="related_entity_type">Type d'entité</Label>
                      <Select value={formData.related_entity_type} onValueChange={(value) => handleInputChange('related_entity_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cattle">Bovin</SelectItem>
                          <SelectItem value="poultry">Volailles</SelectItem>
                          <SelectItem value="crops">Cultures</SelectItem>
                          <SelectItem value="stock">Stock</SelectItem>
                          <SelectItem value="veterinary">Vétérinaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="related_entity_id">ID de l'entité</Label>
                      <Input
                        id="related_entity_id"
                        type="number"
                        value={formData.related_entity_id}
                        onChange={(e) => handleInputChange('related_entity_id', e.target.value)}
                        placeholder="Ex: 123"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-gray-200 hover:border-gray-300"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTransactionMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {createTransactionMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>

          </div>
        </div>
      </LayoutSimple>
    </AuthGuard>
  )
}
