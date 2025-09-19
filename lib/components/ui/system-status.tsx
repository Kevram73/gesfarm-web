"use client"

import { useState, useEffect } from "react"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Wifi, WifiOff, Server, Database, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface SystemStatus {
  api: 'online' | 'offline' | 'slow'
  database: 'online' | 'offline' | 'slow'
  lastSync: string
  uptime: string
}

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    api: 'online',
    database: 'online',
    lastSync: new Date().toLocaleTimeString(),
    uptime: '2h 15m'
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Simuler la vérification du statut système
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastSync: new Date().toLocaleTimeString()
      }))
    }, 30000) // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'slow':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />
      case 'offline':
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <AlertTriangle className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'slow':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="Statut système"
      >
        <div className="relative">
          <Server className="h-4 w-4 text-gray-300" />
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusColor(status.api)}`}></div>
        </div>
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-72 z-50 bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center">
                <Server className="mr-2 h-4 w-4" />
                Statut Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.api)}
                  <span className="text-sm text-gray-300">API Backend</span>
                </div>
                <Badge 
                  variant={status.api === 'online' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {status.api === 'online' ? 'En ligne' : status.api === 'slow' ? 'Lent' : 'Hors ligne'}
                </Badge>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-3 w-3 text-blue-500" />
                  <span className="text-sm text-gray-300">Base de données</span>
                </div>
                <Badge 
                  variant={status.database === 'online' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {status.database === 'online' ? 'En ligne' : status.database === 'slow' ? 'Lent' : 'Hors ligne'}
                </Badge>
              </div>

              <div className="border-t border-gray-700 pt-3 space-y-2">
                {/* Last Sync */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Dernière sync</span>
                  </div>
                  <span className="text-xs text-gray-300">{status.lastSync}</span>
                </div>

                {/* Uptime */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-gray-400">Temps de fonctionnement</span>
                  </div>
                  <span className="text-xs text-gray-300">{status.uptime}</span>
                </div>
              </div>

              {/* Connection Status */}
              <div className="border-t border-gray-700 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {navigator.onLine ? (
                      <Wifi className="h-3 w-3 text-green-500" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-xs text-gray-400">Connexion Internet</span>
                  </div>
                  <Badge 
                    variant={navigator.onLine ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {navigator.onLine ? 'Connecté' : 'Déconnecté'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
