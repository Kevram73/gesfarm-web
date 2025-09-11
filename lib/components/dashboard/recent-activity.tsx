import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import { formatDateTime } from "@/lib/utils"
import { User, FileText, Settings, Bell } from "lucide-react"

const activities = [
  {
    id: 1,
    user: "Jean Dupont",
    action: "a créé un nouveau document",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: "document",
    avatar: "/avatars/jean.jpg"
  },
  {
    id: 2,
    user: "Marie Martin",
    action: "a mis à jour ses paramètres",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: "settings",
    avatar: "/avatars/marie.jpg"
  },
  {
    id: 3,
    user: "Pierre Durand",
    action: "a rejoint l'équipe",
    time: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    type: "user",
    avatar: "/avatars/pierre.jpg"
  },
  {
    id: 4,
    user: "Système",
    action: "Nouvelle notification envoyée",
    time: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
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

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const colorClass = getActivityColor(activity.type)
            
            return (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.user}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDateTime(activity.time)}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
