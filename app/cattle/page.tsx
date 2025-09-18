"use client"

import { AuthGuard } from "@/lib/components/auth/auth-guard"
import { Layout } from "@/lib/components/layout"
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
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion Bovine</h1>
            <p className="text-gray-600 mt-2">
              Chargement du troupeau...
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  const cattle = cattleData?.data || []
  
  // Debug: Log des données pour vérifier
  console.log("Cattle data:", cattleData)
  console.log("Cattle array:", cattle)
  console.log("First cattle weight:", cattle[0]?.current_weight, typeof cattle[0]?.current_weight)

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
      <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion Bovine</h1>
            <p className="text-gray-600 mt-2">
              Suivi du troupeau bovin et de la production laitière.
            </p>
          </div>
          <Button onClick={() => router.push("/cattle/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un animal
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bovins</CardTitle>
              <Milk className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cattle.length}
              </div>
              <p className="text-xs text-gray-600">
                Animaux enregistrés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Femelles</CardTitle>
              <Weight className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cattle.filter(animal => animal.gender === "female").length}
              </div>
              <p className="text-xs text-gray-600">
                Vaches laitières
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mâles</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cattle.filter(animal => animal.gender === "male").length}
              </div>
              <p className="text-xs text-gray-600">
                Taureaux et bœufs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Poids Moyen</CardTitle>
              <Weight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  if (cattle.length === 0) return "0 kg"
                  
                  const totalWeight = cattle.reduce((sum, animal) => {
                    const weight = parseFloat(animal.current_weight) || 0
                    console.log(`Animal ${animal.name}: weight=${animal.current_weight}, parsed=${weight}`)
                    return sum + weight
                  }, 0)
                  
                  const average = Math.round(totalWeight / cattle.length)
                  console.log(`Total weight: ${totalWeight}, Average: ${average}`)
                  
                  return `${average} kg`
                })()}
              </div>
              <p className="text-xs text-gray-600">
                Poids moyen du troupeau
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un animal..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des bovins */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cattle.map((animal) => {
            const ageInMonths = calculateAge(animal.birth_date)
            const ageYears = Math.floor(ageInMonths / 12)
            const ageMonths = ageInMonths % 12
            
            return (
              <Card key={animal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Milk className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">{animal.tag_number}</CardTitle>
                    </div>
                    <Badge className={`${getGenderColor(animal.gender)} text-white`}>
                      {getGenderLabel(animal.gender)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {animal.name && `${animal.name} • `}{animal.breed}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Poids actuel:</span>
                      <span className="font-medium text-gray-900">
                        {animal.current_weight ? `${animal.current_weight} kg` : "Non pesé"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Âge:</span>
                      <span className="text-gray-900">
                        {ageYears > 0 ? `${ageYears} an${ageYears > 1 ? 's' : ''}` : ''}
                        {ageYears > 0 && ageMonths > 0 ? ' et ' : ''}
                        {ageMonths > 0 ? `${ageMonths} mois` : ''}
                        {ageYears === 0 && ageMonths === 0 ? 'Nouveau-né' : ''}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Zone:</span>
                      <span className="text-gray-900 text-sm">
                        {animal.zone?.name || "Non assignée"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Date de naissance:</span>
                      <span className="text-gray-900 text-sm">
                        {new Date(animal.birth_date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    
                    {animal.gender === "female" && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Production:</span>
                        <span className="text-green-600 font-medium">
                          Laitière
                        </span>
                      </div>
                    )}
                    
                    {animal.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600 italic">
                          {animal.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-2 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/cattle/details/${animal.id}`)}
                      >
                        Détails
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/cattle/edit/${animal.id}`)}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(animal.id, animal.name || animal.tag_number)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {cattleData?.pagination && cattleData.pagination.last_page > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        )}

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
      </div>
      </Layout>
    </AuthGuard>
  )
}
