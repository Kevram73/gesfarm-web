"use client"

import { useState, useEffect } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { Wifi, WifiOff, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface ConnectionStatus {
  online: boolean
  api: 'online' | 'offline' | 'slow'
  lastSync: string
  uptime: string
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    online: true,
    api: 'online',
    lastSync: new Date().toLocaleTimeString(),
    uptime: '2h 15m'
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Vérifier le statut de connexion
    const updateConnectionStatus = () => {
      setStatus(prev => ({
        ...prev,
        online: navigator.onLine,
        lastSync: new Date().toLocaleTimeString()
      }))
    }

    // Écouter les changements de connexion
    window.addEventListener('online', updateConnectionStatus)
    window.addEventListener('offline', updateConnectionStatus)

    // Mise à jour périodique
    const interval = setInterval(updateConnectionStatus, 30000)

    return () => {
      window.removeEventListener('online', updateConnectionStatus)
      window.removeEventListener('offline', updateConnectionStatus)
      clearInterval(interval)
    }
  }, [])

  const getStatusIcon = () => {
    if (!status.online) {
      return <WifiOff className="h-4 w-4 text-red-500" />
    }
    
    switch (status.api) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-500" />
      case 'slow':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    if (!status.online) return 'bg-red-500'
    
    switch (status.api) {
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

  const getStatusText = () => {
    if (!status.online) return 'Hors ligne'
    
    switch (status.api) {
      case 'online':
        return 'En ligne'
      case 'slow':
        return 'Lent'
      case 'offline':
        return 'Hors ligne'
      default:
        return 'Inconnu'
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="Statut de connexion"
      >
        <div className="relative">
          {getStatusIcon()}
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusColor()}`}></div>
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
                <Wifi className="mr-2 h-4 w-4" />
                Statut de connexion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Internet Connection */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status.online ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-300">Connexion Internet</span>
                </div>
                <Badge 
                  variant={status.online ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {status.online ? 'Connecté' : 'Déconnecté'}
                </Badge>
              </div>

              {/* API Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className="text-sm text-gray-300">API Backend</span>
                </div>
                <Badge 
                  variant={status.api === 'online' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {getStatusText()}
                </Badge>
              </div>

              <div className="border-t border-gray-700 pt-3 space-y-2">
                {/* Last Sync */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Dernière synchronisation</span>
                  <span className="text-xs text-gray-300">{status.lastSync}</span>
                </div>

                {/* Uptime */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Temps de fonctionnement</span>
                  <span className="text-xs text-gray-300">{status.uptime}</span>
                </div>
              </div>

              {/* Connection Quality */}
              <div className="border-t border-gray-700 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Qualité de connexion</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`w-1 h-3 rounded-full ${
                          bar <= (status.online ? 4 : 0) ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
