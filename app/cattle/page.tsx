"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { useCattle } from "@/lib/hooks/use-fake-data"
import { Milk, Plus, Search, Filter, Weight, Calendar, MapPin } from "lucide-react"

export default function CattlePage() {
  const { data: cattleData, isLoading } = useCattle({ per_page: 20 })

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

  const cattle = cattleData?.items || []

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

  return (
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
          <Button>
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
                {cattle.length > 0 
                  ? Math.round(cattle.reduce((sum, animal) => sum + (animal.current_weight || 0), 0) / cattle.length)
                  : 0} kg
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
                      <Button variant="outline" size="sm" className="flex-1">
                        Enregistrer
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Détails
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
      </div>
    </Layout>
  )
}
