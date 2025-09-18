"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { User, FileText, Settings, Bell, Activity } from "lucide-react"
import { ClientOnly } from "@/lib/components/ui/client-only"
import { formatDateTime } from "@/lib/utils"

// Données statiques de fallback pour éviter les erreurs d'hydratation
const fallbackActivities = [
  {
    id: 1,
    user: "Jean Dupont",
    action: "a créé un nouveau document",
    timeString: "17 sept. 2025, 18:30",
    type: "document",
  },
  {
    id: 2,
    user: "Marie Martin",
    action: "a mis à jour ses paramètres",
    timeString: "17 sept. 2025, 17:00",
    type: "settings",
  },
  {
    id: 3,
    user: "Pierre Durand",
    action: "a rejoint l'équipe",
    timeString: "17 sept. 2025, 15:00",
    type: "user",
  },
  {
    id: 4,
    user: "Système",
    action: "Nouvelle notification envoyée",
    timeString: "17 sept. 2025, 13:00",
    type: "notification",
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
      return Activity
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

interface ActivityItem {
  id: number
  user: string
  action: string
  time: string | Date
  type: string
}

interface RecentActivityApiProps {
  activities?: ActivityItem[]
  isLoading?: boolean
}

export function RecentActivityApi({ activities = [], isLoading = false }: RecentActivityApiProps) {
  const displayActivities = activities.length > 0 ? activities : fallbackActivities

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => {
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
                  <ClientOnly fallback={<div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>}>
                    {typeof activity.time === 'string' 
                      ? activity.time 
                      : formatDateTime(activity.time)
                    }
                  </ClientOnly>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
