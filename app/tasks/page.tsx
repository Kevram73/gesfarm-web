"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { useTasks } from "@/lib/hooks/use-api-data"
import { CheckSquare, Plus, Search, Filter, Calendar, User, AlertCircle, Clock } from "lucide-react"

export default function TasksPage() {
  const router = useRouter()
  const { data: tasksData, isLoading } = useTasks({ per_page: 20 })

  if (isLoading) {
    return (
      <LayoutSimple>
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
      </LayoutSimple>
    )
  }

  const tasks = tasksData?.items || []

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Haute"
      case "medium": return "Moyenne"
      case "low": return "Basse"
      default: return priority
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500"
      case "in_progress": return "bg-blue-500"
      case "completed": return "bg-green-500"
      case "cancelled": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente"
      case "in_progress": return "En cours"
      case "completed": return "Terminée"
      case "cancelled": return "Annulée"
      default: return status
    }
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "feeding": return "🍽️"
      case "cleaning": return "🧹"
      case "health_check": return "🏥"
      case "harvest": return "🌾"
      case "maintenance": return "🔧"
      case "inspection": return "👁️"
      default: return "📋"
    }
  }

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "feeding": return "Alimentation"
      case "cleaning": return "Nettoyage"
      case "health_check": return "Contrôle sanitaire"
      case "harvest": return "Récolte"
      case "maintenance": return "Maintenance"
      case "inspection": return "Inspection"
      default: return type
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "completed" || status === "cancelled") return false
    return new Date(dueDate) < new Date()
  }

  return (
    <LayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Tâches</h1>
            <p className="text-gray-300 mt-2">
              Suivi et gestion des tâches quotidiennes de l'exploitation.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/tasks/create')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tâches</CardTitle>
              <CheckSquare className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.length}
              </div>
              <p className="text-xs text-gray-600">
                Tâches enregistrées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(task => task.status === "in_progress").length}
              </div>
              <p className="text-xs text-gray-600">
                Tâches actives
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminées</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(task => task.status === "completed").length}
              </div>
              <p className="text-xs text-gray-600">
                Tâches complétées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En retard</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(task => isOverdue(task.due_date, task.status)).length}
              </div>
              <p className="text-xs text-gray-600">
                Tâches en retard
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
                  placeholder="Rechercher une tâche..."
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

        {/* Liste des tâches */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className={`hover:shadow-md transition-shadow ${
              isOverdue(task.due_date, task.status) ? "border-red-200 bg-red-50" : ""
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTaskTypeIcon(task.type)}</span>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                  </div>
                  <Badge className={`${getStatusColor(task.status)} text-white`}>
                    {getStatusLabel(task.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{getTaskTypeLabel(task.type)}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Priorité:</span>
                    <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assigné à:</span>
                    <span className="text-gray-900 text-sm">
                      {task.assigned_to?.name || "Non assigné"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Échéance:</span>
                    <span className={`text-sm ${
                      isOverdue(task.due_date, task.status) ? "text-red-600 font-medium" : "text-gray-900"
                    }`}>
                      {new Date(task.due_date).toLocaleDateString("fr-FR")}
                      {isOverdue(task.due_date, task.status) && (
                        <span className="ml-1">⚠️</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Créée le:</span>
                    <span className="text-gray-900 text-sm">
                      {new Date(task.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  
                  {task.description && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 italic">
                        {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description
                        }
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-2 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/tasks/edit/${task.id}`)}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
                          // Ici vous devriez appeler l'API de suppression
                          console.log("Supprimer tâche:", task.id)
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {tasksData?.pagination && tasksData.pagination.last_page > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Affichage de {tasksData.pagination.from} à {tasksData.pagination.to} sur {tasksData.pagination.total} tâches
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled={tasksData.pagination.current_page === 1}>
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm" disabled={tasksData.pagination.current_page === tasksData.pagination.last_page}>
                    Suivant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LayoutSimple>
  )
}
