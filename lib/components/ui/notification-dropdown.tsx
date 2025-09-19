"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Bell, Check, X, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouveau bétail ajouté',
    message: '3 vaches ont été ajoutées à la zone Nord',
    type: 'success',
    time: 'Il y a 5 min',
    read: false
  },
  {
    id: '2',
    title: 'Alerte stock',
    message: 'Stock de nourriture faible dans la zone Sud',
    type: 'warning',
    time: 'Il y a 1h',
    read: false
  },
  {
    id: '3',
    title: 'Rapport mensuel',
    message: 'Votre rapport financier de décembre est prêt',
    type: 'info',
    time: 'Il y a 2h',
    read: true
  }
]

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Bell className="h-4 w-4 text-gray-300" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 flex items-center justify-center"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-80 z-50 bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-400 hover:text-blue-300"
                    onClick={markAllAsRead}
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-gray-750' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-white' : 'text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-700">
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => {
                      setIsOpen(false)
                      // TODO: Naviguer vers toutes les notifications
                    }}
                  >
                    Voir toutes les notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
