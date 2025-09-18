import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import { useNotifications } from "@/lib/hooks/use-api-data"
import { formatDateTime } from "@/lib/utils"
import { User, FileText, Settings, Bell, Activity, AlertTriangle, CheckCircle, Info } from "lucide-react"

// Données statiques avec des dates fixes pour éviter les erreurs d'hydratation
const activities = [
  {
    id: 1,
    user: "Jean Dupont",
    action: "a créé un nouveau document",
    timeString: "17 sept. 2025, 18:30",
    type: "document",
    avatar: "/avatars/jean.jpg"
  },
  {
    id: 2,
    user: "Marie Martin",
    action: "a mis à jour ses paramètres",
    timeString: "17 sept. 2025, 17:00",
    type: "settings",
    avatar: "/avatars/marie.jpg"
  },
  {
    id: 3,
    user: "Pierre Durand",
    action: "a rejoint l'équipe",
    timeString: "17 sept. 2025, 15:00",
    type: "user",
    avatar: "/avatars/pierre.jpg"
  },
  {
    id: 4,
    user: "Système",
    action: "Nouvelle notification envoyée",
    timeString: "17 sept. 2025, 13:00",
    type: "notification",
    avatar: null
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "document":
      return FileText
    case "settings":
      return Settings
    case "user":
      return User
    case "notification":
      return Bell
    default:
      return User
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "document":
      return "bg-blue-500"
    case "settings":
      return "bg-green-500"
    case "user":
      return "bg-purple-500"
    case "notification":
      return "bg-orange-500"
    default:
      return "bg-gray-500"
  }
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "info":
      return Info
    case "warning":
      return AlertTriangle
    case "success":
      return CheckCircle
    case "error":
      return AlertTriangle
    default:
      return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "info":
      return "bg-blue-500"
    case "warning":
      return "bg-yellow-500"
    case "success":
      return "bg-green-500"
    case "error":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function RecentActivity() {
  const { data: notificationsData, isLoading } = useNotifications({ per_page: 5 })
  
  // Utiliser les données API s'il y en a, sinon utiliser les données statiques
  const displayData = notificationsData?.data?.length > 0 ? notificationsData.data : activities

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayData.map((item: any) => {
              // Pour les notifications API
              if (item.title && item.message) {
                const Icon = getNotificationIcon(item.type)
                const colorClass = getNotificationColor(item.type)
                
                return (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.message}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateTime(item.created_at)}
                    </div>
                  </div>
                )
              }
              
              // Pour les données statiques de fallback
              const Icon = getActivityIcon(item.type)
              const colorClass = getActivityColor(item.type)
              
              return (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.action}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.timeString}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
