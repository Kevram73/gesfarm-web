"use client"

import { AuthGuard } from "@/lib/components/auth/auth-guard"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { useCattle, useDeleteCattle } from "@/lib/hooks/use-api-data"
import { useRouter } from "next/navigation"
import { Milk, Plus, Search, Filter, Weight, Calendar, MapPin, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { ConfirmDialog } from "@/lib/components/ui/confirm-dialog"

export default function CattlePage() {
  const router = useRouter()
  const { data: cattleData, isLoading } = useCattle({ per_page: 20 })
  const deleteCattleMutation = useDeleteCattle()
  
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    cattleId: number | null
    cattleName: string
  }>({
    isOpen: false,
    cattleId: null,
    cattleName: ""
  })

  if (isLoading) {
    return (
      <AuthGuard>
        <LayoutSimple>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">Chargement du troupeau</h2>
                <p className="text-gray-500">Veuillez patienter...</p>
              </div>
            </div>
          </div>
        </LayoutSimple>
      </AuthGuard>
    )
  }

  const cattle = cattleData?.data || []

  const getGenderLabel = (gender: string) => {
    return gender === "female" ? "Femelle" : "Mâle"
  }

  const getGenderColor = (gender: string) => {
    return gender === "female" ? "bg-pink-500" : "bg-blue-500"
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())
    return ageInMonths
  }

  const handleDelete = async () => {
    if (!deleteDialog.cattleId) return

    try {
      await deleteCattleMutation.mutateAsync(deleteDialog.cattleId)
      toast.success("Bovin supprimé avec succès")
      setDeleteDialog({ isOpen: false, cattleId: null, cattleName: "" })
    } catch (error: any) {
      console.error("Error deleting cattle:", error)
      toast.error(error.response?.data?.message || "Erreur lors de la suppression du bovin")
    }
  }

  const openDeleteDialog = (cattleId: number, cattleName: string) => {
    setDeleteDialog({
      isOpen: true,
      cattleId,
      cattleName
    })
  }

  return (
    <AuthGuard>
      <LayoutSimple>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header simplifié */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-light text-gray-900">Troupeau Bovin</h1>
                  <p className="text-gray-500 mt-3 text-lg">
                    {cattle.length} animaux enregistrés
                  </p>
                </div>
                <Button 
                  onClick={() => router.push("/cattle/add")}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Ajouter un animal
                </Button>
              </div>
            </div>

            {/* Statistiques simplifiées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <Weight className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-3xl font-light text-gray-900">
                      {cattle.filter(animal => animal.gender === "female").length}
                    </p>
                    <p className="text-gray-500">Femelles</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-3xl font-light text-gray-900">
                      {cattle.filter(animal => animal.gender === "male").length}
                    </p>
                    <p className="text-gray-500">Mâles</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Weight className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-3xl font-light text-gray-900">
                      {(() => {
                        if (cattle.length === 0) return "0"
                        const totalWeight = cattle.reduce((sum, animal) => {
                          const weight = parseFloat(String(animal.current_weight)) || 0
                          return sum + weight
                        }, 0)
                        const average = Math.round(totalWeight / cattle.length)
                        return `${average}`
                      })()} kg
                    </p>
                    <p className="text-gray-500">Poids moyen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recherche simplifiée */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher un animal..."
                  className="pl-12 py-4 text-lg border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Liste des bovins simplifiée */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cattle.map((animal) => {
                const ageInMonths = calculateAge(animal.birth_date)
                const ageYears = Math.floor(ageInMonths / 12)
                const ageMonths = ageInMonths % 12
                
                return (
                  <div key={animal.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    
                    {/* Header de la carte */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-medium text-gray-900">{animal.tag_number}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          animal.gender === "female" 
                            ? "bg-pink-100 text-pink-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {getGenderLabel(animal.gender)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-lg">
                        {animal.name && `${animal.name} • `}{animal.breed}
                      </p>
                    </div>

                    {/* Informations principales */}
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-500">Poids</span>
                        <span className="font-medium text-gray-900">
                          {animal.current_weight ? `${animal.current_weight} kg` : "Non pesé"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-500">Âge</span>
                        <span className="text-gray-900">
                          {ageYears > 0 ? `${ageYears} an${ageYears > 1 ? 's' : ''}` : ''}
                          {ageYears > 0 && ageMonths > 0 ? ' et ' : ''}
                          {ageMonths > 0 ? `${ageMonths} mois` : ''}
                          {ageYears === 0 && ageMonths === 0 ? 'Nouveau-né' : ''}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-500">Zone</span>
                        <span className="text-gray-900">
                          {(animal as any).zone?.name || "Non assignée"}
                        </span>
                      </div>
                    </div>

                    {/* Notes si présentes */}
                    {animal.notes && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 italic">
                          {animal.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 py-3 border-gray-200 hover:border-green-500 hover:text-green-600"
                        onClick={() => router.push(`/cattle/details/${animal.id}`)}
                      >
                        Détails
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 py-3 border-gray-200 hover:border-blue-500 hover:text-blue-600"
                        onClick={() => router.push(`/cattle/edit/${animal.id}`)}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        className="px-4 py-3 border-gray-200 hover:border-red-500 hover:text-red-600"
                        onClick={() => openDeleteDialog(animal.id, animal.name || animal.tag_number)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination simplifiée */}
            {(cattleData as any)?.pagination && (cattleData as any).pagination.last_page > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-3">
                  <Button variant="outline" className="px-6 py-3 rounded-xl">
                    Précédent
                  </Button>
                  <Button variant="outline" className="px-6 py-3 rounded-xl">
                    Suivant
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Dialogue de confirmation de suppression */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, cattleId: null, cattleName: "" })}
          onConfirm={handleDelete}
          title="Supprimer le bovin"
          message={`Êtes-vous sûr de vouloir supprimer ${deleteDialog.cattleName} ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          isLoading={deleteCattleMutation.isPending}
          variant="destructive"
        />
      </LayoutSimple>
    </AuthGuard>
  )
}
