"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { useCreateTask, useUsers } from "@/lib/hooks/use-api-data"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, CheckSquare } from "lucide-react"

export default function CreateTaskPage() {
  const router = useRouter()
  const createTask = useCreateTask()
  const { data: usersData } = useUsers()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "medium",
    status: "pending",
    assigned_to: "",
    due_date: "",
    notes: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const taskTypes = [
    { value: "feeding", label: "Alimentation" },
    { value: "cleaning", label: "Nettoyage" },
    { value: "health_check", label: "Contrôle sanitaire" },
    { value: "harvest", label: "Récolte" },
    { value: "maintenance", label: "Maintenance" },
    { value: "inspection", label: "Inspection" },
    { value: "other", label: "Autre" }
  ]

  const priorities = [
    { value: "low", label: "Basse" },
    { value: "medium", label: "Moyenne" },
    { value: "high", label: "Haute" }
  ]

  const statuses = [
    { value: "pending", label: "En attente" },
    { value: "in_progress", label: "En cours" },
    { value: "completed", label: "Terminée" },
    { value: "cancelled", label: "Annulée" }
  ]

  const users = usersData?.items || []

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Le titre est requis"
    if (!formData.type) newErrors.type = "Le type de tâche est requis"
    if (!formData.due_date) newErrors.due_date = "La date d'échéance est requise"

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
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        priority: formData.priority,
        status: formData.status,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        due_date: formData.due_date,
        notes: formData.notes || null
      })
      
      toast.success("Tâche créée avec succès !")
      router.push("/tasks")
    } catch (error: any) {
      toast.error(`Erreur lors de la création: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <LayoutSimple>
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
              <h1 className="text-3xl font-bold tracking-tight text-white">Nouvelle Tâche</h1>
              <p className="text-gray-300 mt-2">
                Créer une nouvelle tâche pour l'exploitation
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckSquare className="mr-2 h-5 w-5" />
              Informations de la tâche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Titre */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Titre de la tâche *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ex: Nettoyage du poulailler principal"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type de tâche *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                </div>

                {/* Priorité */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assigné à */}
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigné à</Label>
                  <Select value={formData.assigned_to} onValueChange={(value) => handleInputChange("assigned_to", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date d'échéance */}
                <div className="space-y-2">
                  <Label htmlFor="due_date">Date d'échéance *</Label>
                  <Input
                    id="due_date"
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange("due_date", e.target.value)}
                    className={errors.due_date ? "border-red-500" : ""}
                  />
                  {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Description détaillée de la tâche..."
                    rows={4}
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
                  disabled={createTask.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createTask.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Créer la tâche
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </LayoutSimple>
  )
}
