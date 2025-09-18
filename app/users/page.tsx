"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { useUsers } from "@/lib/hooks/use-api-data"
import { User, Plus, Search, Filter, Mail, Phone, Shield, Edit, Trash2 } from "lucide-react"

export default function UsersPage() {
  const router = useRouter()
  const { data: usersData, isLoading } = useUsers({ per_page: 20 })

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  const users = usersData?.items || []

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500"
      case "manager": return "bg-blue-500"
      case "worker": return "bg-green-500"
      case "viewer": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrateur"
      case "manager": return "Gestionnaire"
      case "worker": return "Ouvrier"
      case "viewer": return "Observateur"
      default: return role
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "inactive": return "bg-gray-500"
      case "suspended": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Actif"
      case "inactive": return "Inactif"
      case "suspended": return "Suspendu"
      default: return status
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Utilisateurs</h1>
            <p className="text-gray-300 mt-2">
              Gérer les utilisateurs et leurs permissions dans le système.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/users/create')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <User className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.length}
              </div>
              <p className="text-xs text-gray-600">
                Utilisateurs enregistrés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(user => user.roles?.includes("admin")).length}
              </div>
              <p className="text-xs text-gray-600">
                Accès complet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gestionnaires</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(user => user.roles?.includes("manager")).length}
              </div>
              <p className="text-xs text-gray-600">
                Gestion des données
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actifs</CardTitle>
              <User className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(user => user.status === "active").length}
              </div>
              <p className="text-xs text-gray-600">
                Utilisateurs actifs
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
                  placeholder="Rechercher un utilisateur..."
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

        {/* Liste des utilisateurs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                  </div>
                  <Badge className={`${getStatusColor(user.status)} text-white`}>
                    {getStatusLabel(user.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{user.email}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rôles:</span>
                    <div className="flex space-x-1">
                      {user.roles?.map((role) => (
                        <Badge key={role} className={`${getRoleColor(role)} text-white text-xs`}>
                          {getRoleLabel(role)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {user.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Téléphone:</span>
                      <span className="text-gray-900 text-sm">
                        {user.phone}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Créé le:</span>
                    <span className="text-gray-900 text-sm">
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Dernière connexion:</span>
                    <span className="text-gray-900 text-sm">
                      {user.last_login_at 
                        ? new Date(user.last_login_at).toLocaleDateString("fr-FR")
                        : "Jamais"
                      }
                    </span>
                  </div>
                  
                  <div className="pt-2 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/users/edit/${user.id}`)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
                          // Ici vous devriez appeler l'API de suppression
                          console.log("Supprimer utilisateur:", user.id)
                        }
                      }}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {usersData?.pagination && usersData.pagination.last_page > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Affichage de {usersData.pagination.from} à {usersData.pagination.to} sur {usersData.pagination.total} utilisateurs
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled={usersData.pagination.current_page === 1}>
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm" disabled={usersData.pagination.current_page === usersData.pagination.last_page}>
                    Suivant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}