"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Badge } from "@/lib/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff,
  LogOut
} from "lucide-react"
import toast from "react-hot-toast"
import { useUserSettings, useUpdateUserSettings, useCurrentUser } from "@/lib/hooks/use-api-data"
import { useLogout } from "@/lib/hooks/use-auth"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  
  // États pour les formulaires
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  })
  
  const [farmData, setFarmData] = useState({
    name: "",
    location: "",
    size: "",
    established: ""
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    stock_alerts: true,
    vaccination_reminders: true,
    system_updates: false
  })
  
  const [localeSettings, setLocaleSettings] = useState({
    language: "fr",
    timezone: "Africa/Abidjan"
  })

  // Hooks API
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: settings, isLoading: settingsLoading } = useUserSettings()
  const updateSettingsMutation = useUpdateUserSettings()
  const logoutMutation = useLogout()

  // Initialiser les données quand elles sont chargées
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || ""
      })
    }
  }, [user])

  useEffect(() => {
    if (settings) {
      setFarmData({
        name: settings.farm?.name || "",
        location: settings.farm?.location || "",
        size: settings.farm?.size || "",
        established: settings.farm?.established || ""
      })
      
      setNotificationSettings(settings.notifications || {
        email: true,
        push: true,
        sms: false,
        stock_alerts: true,
        vaccination_reminders: true,
        system_updates: false
      })
      
      setLocaleSettings({
        language: settings.language || "fr",
        timezone: settings.timezone || "Africa/Abidjan"
      })
    }
  }, [settings])

  const handleProfileSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        ...settings,
        user: profileData
      })
      toast.success("Profil mis à jour avec succès !")
      setIsEditing(false)
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleFarmSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        ...settings,
        farm: farmData
      })
      toast.success("Informations de l'exploitation mises à jour !")
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleNotificationSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        ...settings,
        notifications: notificationSettings
      })
      toast.success("Paramètres de notifications mis à jour !")
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleLocaleSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        ...settings,
        language: localeSettings.language,
        timezone: localeSettings.timezone
      })
      toast.success("Paramètres de langue et région mis à jour !")
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`)
    }
  }

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
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

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "farm", label: "Exploitation", icon: Database },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "locale", label: "Langue & Région", icon: Globe },
  ]

  if (userLoading || settingsLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 rounded-lg text-white">
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="mt-2 opacity-90">
              Configuration de votre compte et de l'exploitation.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Menu de navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {tab.label}
                      </Button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profil utilisateur */}
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profil Utilisateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nom complet</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Rôle</Label>
                      <div className="mt-1">
                        <Badge className="bg-green-500 text-white">
                          {user?.role || "Utilisateur"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Statut du compte</Label>
                      <div className="mt-1 flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">
                          {user?.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>ID Utilisateur</Label>
                      <div className="mt-1 text-sm text-gray-600">
                        {user?.id || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Membre depuis</Label>
                      <div className="mt-1 text-sm text-gray-600">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleProfileSave}
                    disabled={updateSettingsMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateSettingsMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Paramètres de l'exploitation */}
            {activeTab === "farm" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Informations de l'Exploitation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="farm-name">Nom de l'exploitation</Label>
                      <Input 
                        id="farm-name" 
                        value={farmData.name}
                        onChange={(e) => setFarmData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Localisation</Label>
                      <Input 
                        id="location" 
                        value={farmData.location}
                        onChange={(e) => setFarmData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="size">Taille</Label>
                      <Input 
                        id="size" 
                        value={farmData.size}
                        onChange={(e) => setFarmData(prev => ({ ...prev, size: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="established">Année d'établissement</Label>
                      <Input 
                        id="established" 
                        value={farmData.established}
                        onChange={(e) => setFarmData(prev => ({ ...prev, established: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleFarmSave}
                    disabled={updateSettingsMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateSettingsMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Paramètres de notifications */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifications par email</Label>
                        <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleNotification("email")}
                      >
                        {notificationSettings.email ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifications push</Label>
                        <p className="text-sm text-gray-600">Recevoir des notifications push</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleNotification("push")}
                      >
                        {notificationSettings.push ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alertes de stock</Label>
                        <p className="text-sm text-gray-600">Notifications pour les stocks bas</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleNotification("stock_alerts")}
                      >
                        {notificationSettings.stock_alerts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Rappels de vaccination</Label>
                        <p className="text-sm text-gray-600">Rappels pour les vaccinations</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleNotification("vaccination_reminders")}
                      >
                        {notificationSettings.vaccination_reminders ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleNotificationSave}
                    disabled={updateSettingsMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateSettingsMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Paramètres de langue et région */}
            {activeTab === "locale" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Langue & Région
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="language">Langue</Label>
                      <Select 
                        value={localeSettings.language} 
                        onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <Select 
                        value={localeSettings.timezone} 
                        onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, timezone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Abidjan">Abidjan (GMT+0)</SelectItem>
                          <SelectItem value="Africa/Dakar">Dakar (GMT+0)</SelectItem>
                          <SelectItem value="Africa/Bamako">Bamako (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleLocaleSave}
                    disabled={updateSettingsMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateSettingsMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Autres onglets */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Gérez les paramètres de sécurité de votre compte.</p>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline"
                      onClick={() => router.push("/profile")}
                    >
                      Aller au profil
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {logoutMutation.isPending ? "Déconnexion..." : "Déconnexion"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Apparence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Personnalisez l'apparence de l'application.</p>
                  <p className="text-sm text-gray-500 mt-2">Fonctionnalité à venir...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}