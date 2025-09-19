"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { Zap, Plus, Search, Settings, Bell, User, DollarSign, Package } from "lucide-react"

interface QuickAction {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  href: string
  shortcut?: string
}

const quickActions: QuickAction[] = [
  {
    id: 'add-cattle',
    label: 'Ajouter du bétail',
    description: 'Enregistrer un nouvel animal',
    icon: <Plus className="h-4 w-4" />,
    href: '/cattle/add',
    shortcut: 'Ctrl+N'
  },
  {
    id: 'search',
    label: 'Rechercher',
    description: 'Trouver rapidement des informations',
    icon: <Search className="h-4 w-4" />,
    href: '#',
    shortcut: 'Ctrl+K'
  },
  {
    id: 'financial',
    label: 'Finances',
    description: 'Gérer les transactions financières',
    icon: <DollarSign className="h-4 w-4" />,
    href: '/financial',
    shortcut: 'Alt+4'
  },
  {
    id: 'stocks',
    label: 'Stocks',
    description: 'Vérifier les niveaux de stock',
    icon: <Package className="h-4 w-4" />,
    href: '/stocks',
    shortcut: 'Alt+5'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Voir les alertes récentes',
    icon: <Bell className="h-4 w-4" />,
    href: '/notifications',
    shortcut: 'Alt+N'
  },
  {
    id: 'profile',
    label: 'Profil',
    description: 'Gérer votre compte',
    icon: <User className="h-4 w-4" />,
    href: '/profile',
    shortcut: 'Alt+P'
  }
]

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  const handleActionClick = (action: QuickAction) => {
    if (action.href !== '#') {
      window.location.href = action.href
    } else {
      // Pour la recherche, focus sur l'input de recherche
      const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="Actions rapides"
      >
        <Zap className="h-4 w-4 text-gray-300" />
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
              <CardTitle className="text-sm text-white flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="w-full justify-start text-left p-3 hover:bg-gray-700"
                  onClick={() => handleActionClick(action)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className="flex-shrink-0 mt-0.5 text-gray-400">
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {action.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {action.description}
                      </p>
                    </div>
                    {action.shortcut && (
                      <Badge variant="outline" className="text-xs bg-gray-600 border-gray-500 text-gray-300">
                        {action.shortcut}
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
