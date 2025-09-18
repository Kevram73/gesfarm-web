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
  Settings,
  Lock
} from "lucide-react"
import toast from "react-hot-toast"
import { Layout } from "@/lib/components/layout/layout"
import { useCurrentUser, useUpdateUserProfile, useChangePassword } from "@/lib/hooks/use-api-data"
import { useLogout } from "@/lib/hooks/use-auth"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  })
  
  const router = useRouter()
  const { data: user, isLoading, error } = useCurrentUser()
  const updateProfileMutation = useUpdateUserProfile()
  const changePasswordMutation = useChangePassword()
  const logoutMutation = useLogout()

  // Initialiser les données du formulaire quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData)
      toast.success("Profil mis à jour avec succès !")
      setIsEditing(false)
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    try {
      await changePasswordMutation.mutateAsync(passwordData)
      toast.success("Mot de passe modifié avec succès !")
      setIsChangingPassword(false)
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
      })
    } catch (error: any) {
      toast.error(`Erreur lors du changement de mot de passe: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      })
    }
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success("Déconnexion réussie !")
      // La redirection est gérée automatiquement dans le hook useLogout
    } catch (error: any) {
      toast.error(`Erreur lors de la déconnexion: ${error.message}`)
    }
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

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur de chargement</h2>
            <p className="text-gray-400 mb-4">Impossible de charger votre profil</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
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
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
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
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Informations principales */}
          <div className="md:col-span-2 space-y-6">
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
                    <Label htmlFor="name" className="text-gray-300">Nom complet *</Label>
                      <Input
                        id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      disabled={!isEditing}
                      />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      disabled={!isEditing}
                      />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
                      <Input
                        id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="+33 6 12 34 56 78"
                      disabled={!isEditing}
                      />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-300">Adresse</Label>
                      <Input
                        id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="123 Rue de la Ferme, 75000 Paris"
                      disabled={!isEditing}
                      />
                  </div>
                </div>
                
                {/* Informations supplémentaires */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Statut du compte</Label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-300">
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Dernière connexion</Label>
                    <div className="text-sm text-gray-300">
                      {user.updated_at ? new Date(user.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Changement de mot de passe */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Sécurité
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Modifiez votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isChangingPassword ? (
                  <Button
                    onClick={() => setIsChangingPassword(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password" className="text-gray-300">Mot de passe actuel *</Label>
                      <Input
                        id="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => handlePasswordChange("current_password", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new_password" className="text-gray-300">Nouveau mot de passe *</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => handlePasswordChange("new_password", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new_password_confirmation" className="text-gray-300">Confirmer le nouveau mot de passe *</Label>
                      <Input
                        id="new_password_confirmation"
                        type="password"
                        value={passwordData.new_password_confirmation}
                        onChange={(e) => handlePasswordChange("new_password_confirmation", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleChangePassword}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={changePasswordMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {changePasswordMutation.isPending ? "Modification..." : "Modifier le mot de passe"}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordData({
                            current_password: "",
                            new_password: "",
                            new_password_confirmation: ""
                          })
                        }}
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
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
                      {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white">{user.name || 'Utilisateur'}</h3>
                    <Badge className={`${getRoleColor(user.role || 'user')} text-white mt-2`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {getRoleLabel(user.role || 'user')}
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
                  <span className="text-sm">{user.email || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Membre depuis {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">ID: {user.id || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Sécurité
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutMutation.isPending ? "Déconnexion..." : "Déconnexion"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}