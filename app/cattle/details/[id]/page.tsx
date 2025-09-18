"use client"

import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { useCattle, useDeleteCattle } from "@/lib/hooks/use-api-data"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Weight, Calendar, MapPin, User, Heart } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { ConfirmDialog } from "@/lib/components/ui/confirm-dialog"

export default function CattleDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const cattleId = params.id as string
  
  const { data: cattleData, isLoading } = useCattle({ per_page: 100 })
  const deleteCattleMutation = useDeleteCattle()
  const cattle = cattleData?.data?.find((c: any) => c.id.toString() === cattleId)
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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

  const getGenderLabel = (gender: string) => {
    return gender === "female" ? "Femelle" : "Mâle"
  }

  const getGenderColor = (gender: string) => {
    return gender === "female" ? "bg-pink-500" : "bg-blue-500"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "sold": return "bg-yellow-500"
      case "deceased": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Actif"
      case "sold": return "Vendu"
      case "deceased": return "Décédé"
      default: return status
    }
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())
    return ageInMonths
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const handleDelete = async () => {
    try {
      await deleteCattleMutation.mutateAsync(parseInt(cattleId))
      toast.success("Bovin supprimé avec succès")
      router.push("/cattle")
    } catch (error: any) {
      console.error("Error deleting cattle:", error)
      toast.error(error.response?.data?.message || "Erreur lors de la suppression du bovin")
    }
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{cattle.name}</h1>
              <p className="text-gray-600 mt-1">{cattle.tag_number} - {cattle.breed}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/cattle/edit/${cattle.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p className="text-lg font-semibold">{cattle.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Numéro d'identification</label>
                  <p className="text-lg font-semibold">{cattle.tag_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Race</label>
                  <p className="text-lg font-semibold">{cattle.breed}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Sexe</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getGenderColor(cattle.gender)}`}></div>
                    <span className="text-lg font-semibold">{getGenderLabel(cattle.gender)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                  <p className="text-lg font-semibold">{formatDate(cattle.birth_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Âge</label>
                  <p className="text-lg font-semibold">{calculateAge(cattle.birth_date)} mois</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Statut</label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(cattle.status)} text-white`}>
                    {getStatusLabel(cattle.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations physiques et localisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5" />
                Informations Physiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Poids actuel</label>
                <p className="text-2xl font-bold text-blue-600">{cattle.current_weight} kg</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mère</label>
                  <p className="text-lg font-semibold">{cattle.mother_tag || "Non renseignée"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Père</label>
                  <p className="text-lg font-semibold">{cattle.father_tag || "Non renseigné"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Zone</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-lg font-semibold">{cattle.zone?.name || "Non assignée"}</span>
                </div>
                {cattle.zone && (
                  <p className="text-sm text-gray-500 mt-1">{cattle.zone.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes et historique */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Notes et Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {cattle.notes || "Aucune note renseignée"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date de création</label>
                    <p className="text-sm text-gray-900">{formatDate(cattle.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dernière modification</label>
                    <p className="text-sm text-gray-900">{formatDate(cattle.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enregistrements */}
          {cattle.records && cattle.records.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Enregistrements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cattle.records.map((record: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{record.type}</h4>
                          <p className="text-sm text-gray-500">{record.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{record.value} {record.unit}</p>
                          <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dialogue de confirmation de suppression */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Supprimer le bovin"
          message={`Êtes-vous sûr de vouloir supprimer ${cattle?.name || cattle?.tag_number} ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          isLoading={deleteCattleMutation.isPending}
          variant="destructive"
        />
      </div>
    </Layout>
  )
}
