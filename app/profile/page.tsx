"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import { Badge } from "@/lib/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X,
  LogOut,
  Settings
} from "lucide-react"
import toast from "react-hot-toast"
import { Layout } from "@/lib/components/layout/layout"

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  role: string
  joinDate: string
  avatar?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setEditedUser(parsedUser)
    } else {
      // Rediriger vers login si pas connecté
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleSave = () => {
    if (editedUser) {
      localStorage.setItem("user", JSON.stringify(editedUser))
      setUser(editedUser)
      setIsEditing(false)
      toast.success("Profil mis à jour avec succès !")
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    toast.success("Déconnexion réussie !")
    router.push("/login")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-600"
      case "manager": return "bg-blue-600"
      case "user": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrateur"
      case "manager": return "Gestionnaire"
      case "user": return "Utilisateur"
      default: return "Utilisateur"
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
            <p className="text-gray-400 mt-2">Gérez vos informations personnelles</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </>
            )}
            <Button
              onClick={handleLogout}
              variant="destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Informations principales */}
          <div className="md:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations Personnelles
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Vos données de profil et informations de contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nom complet</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedUser?.name || ""}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, name: e.target.value} : null)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-white">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedUser?.email || ""}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-white">{user.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedUser?.phone || ""}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, phone: e.target.value} : null)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="+33 6 12 34 56 78"
                      />
                    ) : (
                      <p className="text-white">{user.phone || "Non renseigné"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-300">Adresse</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editedUser?.address || ""}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, address: e.target.value} : null)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="123 Rue de la Ferme, 75000 Paris"
                      />
                    ) : (
                      <p className="text-white">{user.address || "Non renseignée"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec avatar et infos */}
          <div className="space-y-6">
            {/* Avatar et rôle */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-green-600 text-white text-2xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                    <Badge className={`${getRoleColor(user.role)} text-white mt-2`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Informations Système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Membre depuis {new Date(user.joinDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">ID: {user.id}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Sécurité
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
