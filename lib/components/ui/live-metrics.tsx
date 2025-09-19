"use client"

import { useState, useEffect } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Metric {
  id: string
  label: string
  value: number
  change: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

const mockMetrics: Metric[] = [
  {
    id: 'cattle',
    label: 'Bétail',
    value: 127,
    change: 3,
    unit: 'têtes',
    trend: 'up'
  },
  {
    id: 'zones',
    label: 'Zones actives',
    value: 8,
    change: 0,
    unit: 'zones',
    trend: 'stable'
  },
  {
    id: 'revenue',
    label: 'Revenus mensuels',
    value: 15420,
    change: -2.5,
    unit: '€',
    trend: 'down'
  },
  {
    id: 'alerts',
    label: 'Alertes actives',
    value: 3,
    change: 1,
    unit: 'alertes',
    trend: 'up'
  }
]

export function LiveMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>(mockMetrics)
  const [isOpen, setIsOpen] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Simuler la mise à jour des métriques
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + Math.floor(Math.random() * 3) - 1,
        change: Math.random() * 10 - 5
      })))
      setLastUpdate(new Date())
    }, 30000) // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />
      case 'stable':
        return <Minus className="h-3 w-3 text-gray-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      case 'stable':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === '€') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
      }).format(value)
    }
    return `${value} ${unit}`
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="Métriques en temps réel"
      >
        <div className="relative">
          <Activity className="h-4 w-4 text-gray-300" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
          <Card className="absolute right-0 top-12 w-80 z-50 bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Métriques en temps réel
                </CardTitle>
                <Badge variant="outline" className="text-xs text-gray-400">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{metric.label}</p>
                    <p className="text-lg font-semibold text-white">
                      {formatValue(metric.value, metric.unit)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-700 pt-3">
                <p className="text-xs text-gray-400 text-center">
                  Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}