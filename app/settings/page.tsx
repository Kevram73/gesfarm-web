"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Badge } from "@/lib/components/ui/badge"
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
  EyeOff
} from "lucide-react"

export default function SettingsPage() {
  // Données factices pour les paramètres
  const userSettings = {
    name: "Administrateur GESFARM",
    email: "admin@gesfarm.com",
    role: "Administrateur",
    language: "fr",
    timezone: "Africa/Abidjan",
    notifications: {
      email: true,
      push: true,
      sms: false,
      stock_alerts: true,
      vaccination_reminders: true,
      system_updates: false
    },
    farm: {
      name: "Ferme Modèle",
      location: "Abidjan, Côte d'Ivoire",
      size: "50 hectares",
      established: "2020"
    }
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
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Sécurité
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="mr-2 h-4 w-4" />
                    Exploitation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="mr-2 h-4 w-4" />
                    Apparence
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="mr-2 h-4 w-4" />
                    Langue & Région
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profil utilisateur */}
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
                    <Input id="name" defaultValue={userSettings.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userSettings.email} />
                  </div>
                </div>
                
                <div>
                  <Label>Rôle</Label>
                  <div className="mt-1">
                    <Badge className="bg-green-500 text-white">
                      {userSettings.role}
                    </Badge>
                  </div>
                </div>
                
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>

            {/* Paramètres de l'exploitation */}
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
                    <Input id="farm-name" defaultValue={userSettings.farm.name} />
                  </div>
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Input id="location" defaultValue={userSettings.farm.location} />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="size">Taille</Label>
                    <Input id="size" defaultValue={userSettings.farm.size} />
                  </div>
                  <div>
                    <Label htmlFor="established">Année d'établissement</Label>
                    <Input id="established" defaultValue={userSettings.farm.established} />
                  </div>
                </div>
                
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>

            {/* Paramètres de notifications */}
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
                    <Button variant="outline" size="sm">
                      {userSettings.notifications.email ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications push</Label>
                      <p className="text-sm text-gray-600">Recevoir des notifications push</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {userSettings.notifications.push ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alertes de stock</Label>
                      <p className="text-sm text-gray-600">Notifications pour les stocks bas</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {userSettings.notifications.stock_alerts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rappels de vaccination</Label>
                      <p className="text-sm text-gray-600">Rappels pour les vaccinations</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {userSettings.notifications.vaccination_reminders ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>

            {/* Paramètres de langue et région */}
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
                    <select 
                      id="language" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={userSettings.language}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <select 
                      id="timezone" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={userSettings.timezone}
                    >
                      <option value="Africa/Abidjan">Abidjan (GMT+0)</option>
                      <option value="Africa/Dakar">Dakar (GMT+0)</option>
                      <option value="Africa/Bamako">Bamako (GMT+0)</option>
                    </select>
                  </div>
                </div>
                
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
