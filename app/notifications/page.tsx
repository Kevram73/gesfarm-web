"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { useNotifications } from "@/lib/hooks/use-fake-data"
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  Filter,
  Check,
  Trash2,
  Settings
} from "lucide-react"

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useNotifications({ per_page: 50 })

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Notifications</h1>
            <p className="text-gray-300 mt-2">
              Chargement des notifications...
            </p>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  const notifications = notificationsData?.items || []

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent": return "Urgent"
      case "high": return "Élevé"
      case "medium": return "Moyen"
      case "low": return "Faible"
      default: return priority
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stock_alert": return AlertTriangle
      case "vaccination_reminder": return CheckCircle
      case "system": return Info
      case "error": return XCircle
      default: return Bell
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock_alert": return "text-red-500"
      case "vaccination_reminder": return "text-green-500"
      case "system": return "text-blue-500"
      case "error": return "text-red-500"
      default: return "text-gray-500"
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="mt-2 opacity-90">
                  Gestion des alertes et notifications de votre exploitation.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm opacity-75">Non lues</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center space-x-4">
          <Button className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600">
            <Check className="mr-2 h-4 w-4" />
            Marquer tout comme lu
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Bell className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-gray-600">Notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non lues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <p className="text-xs text-gray-600">En attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <XCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => n.priority === "urgent").length}
              </div>
              <p className="text-xs text-gray-600">Priorité haute</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => {
                  const today = new Date()
                  const notificationDate = new Date(n.created_at)
                  return notificationDate.toDateString() === today.toDateString()
                }).length}
              </div>
              <p className="text-xs text-gray-600">Nouvelles</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = getTypeIcon(notification.type)
            
            return (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-shadow ${
                  !notification.is_read ? "border-l-4 border-l-blue-500 bg-blue-50" : ""
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-semibold ${
                          !notification.is_read ? "text-gray-900" : "text-gray-700"
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getPriorityColor(notification.priority)} text-white`}>
                            {getPriorityLabel(notification.priority)}
                          </Badge>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString("fr-FR")}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.is_read && (
                            <Button variant="outline" size="sm">
                              Marquer comme lu
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {notificationsData?.pagination && notificationsData.pagination.last_page > 1 && (
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
