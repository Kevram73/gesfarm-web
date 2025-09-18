"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Map } from "@/lib/components/maps"
import { ConfirmDialog } from "@/lib/components/ui/confirm-dialog"
import { useZones, useDeleteZone } from "@/lib/hooks/use-api-data"
import { ArrowLeft, Edit, Trash2, MapPin, Building, TreePine, Droplets, Wheat, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ZoneDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const zoneId = parseInt(params.id as string)
  
  const { data: zonesData, isLoading } = useZones({ per_page: 100 })
  const deleteZoneMutation = useDeleteZone()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "building": return "Bâtiment"
      case "pasture": return "Pâturage"
      case "cultivation": return "Culture"
      case "water": return "Point d'eau"
      case "enclosure": return "Enclos"
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "building": return "bg-blue-500"
      case "pasture": return "bg-green-500"
      case "cultivation": return "bg-yellow-500"
      case "water": return "bg-cyan-500"
      case "enclosure": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "building": return Building
      case "pasture": return TreePine
      case "cultivation": return Wheat
      case "water": return Droplets
      default: return MapPin
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "maintenance": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Actif"
      case "inactive": return "Inactif"
      case "maintenance": return "Maintenance"
      default: return status
    }
  }

  const handleDelete = async () => {
    try {
      await deleteZoneMutation.mutateAsync(zoneId)
      toast.success("Zone supprimée avec succès")
      router.push("/zones")
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur lors de la suppression de la zone")
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    )
  }

  const zone = zonesData?.data?.find(z => z.id === zoneId)
  if (!zone) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Zone non trouvée</h1>
          <p className="text-gray-600 mt-2">La zone demandée n'existe pas.</p>
          <Button onClick={() => router.push("/zones")} className="mt-4">
            Retour aux zones
          </Button>
        </div>
      </Layout>
    )
  }

  const IconComponent = getTypeIcon(zone.type)

  // Marqueur pour la carte
  const mapMarker = {
    position: zone.coordinates.type === "Point" 
      ? zone.coordinates.coordinates 
      : [zone.coordinates.coordinates[0][0][0], zone.coordinates.coordinates[0][0][1]],
    title: zone.name,
    description: zone.description
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
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {zone.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Détails de la zone
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/zones/edit/${zone.id}`)}
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

        {/* Informations générales */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconComponent className="h-5 w-5 mr-2 text-gray-500" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nom:</span>
                <span className="font-medium text-gray-900">{zone.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type:</span>
                <Badge className={`${getTypeColor(zone.type)} text-white`}>
                  {getTypeLabel(zone.type)}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Statut:</span>
                <Badge className={getStatusColor(zone.status)}>
                  {getStatusLabel(zone.status)}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Surface:</span>
                <span className="font-medium text-gray-900">
                  {parseFloat(zone.area).toLocaleString()} m²
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type de géométrie:</span>
                <span className="text-gray-900">{zone.coordinates.type}</span>
              </div>
              
              {zone.coordinates.type === "Point" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Latitude:</span>
                    <span className="font-mono text-sm text-gray-900">
                      {zone.coordinates.coordinates[1].toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Longitude:</span>
                    <span className="font-mono text-sm text-gray-900">
                      {zone.coordinates.coordinates[0].toFixed(6)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Points:</span>
                  <span className="text-gray-900">
                    {zone.coordinates.coordinates[0].length} points
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {zone.description || "Aucune description disponible."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Carte */}
        <Card>
          <CardHeader>
            <CardTitle>Localisation sur la carte</CardTitle>
          </CardHeader>
          <CardContent>
            <Map
              center={zone.coordinates.type === "Point" 
                ? [zone.coordinates.coordinates[1], zone.coordinates.coordinates[0]]
                : [zone.coordinates.coordinates[0][0][1], zone.coordinates.coordinates[0][0][0]]
              }
              zoom={15}
              markers={[mapMarker]}
              className="h-[400px] w-full"
            />
          </CardContent>
        </Card>

        {/* Métadonnées */}
        <Card>
          <CardHeader>
            <CardTitle>Métadonnées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Créé le:</span>
                <span className="text-gray-900">
                  {new Date(zone.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Modifié le:</span>
                <span className="text-gray-900">
                  {new Date(zone.updated_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Supprimer la zone"
        message={`Êtes-vous sûr de vouloir supprimer la zone "${zone.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        isLoading={deleteZoneMutation.isPending}
        variant="destructive"
      />
    </Layout>
  )
}
