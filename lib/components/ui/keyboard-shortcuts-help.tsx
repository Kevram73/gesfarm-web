"use client"

import { useState, useEffect } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { Keyboard, X, Search, Settings, HelpCircle, Home, Users, DollarSign, Bell } from "lucide-react"

interface Shortcut {
  keys: string[]
  description: string
  icon: React.ReactNode
}

const shortcuts: Shortcut[] = [
  {
    keys: ['Ctrl', 'K'],
    description: 'Rechercher',
    icon: <Search className="h-4 w-4" />
  },
  {
    keys: ['Ctrl', '/'],
    description: 'Aide',
    icon: <HelpCircle className="h-4 w-4" />
  },
  {
    keys: ['Ctrl', ','],
    description: 'Paramètres',
    icon: <Settings className="h-4 w-4" />
  },
  {
    keys: ['Alt', '1'],
    description: 'Tableau de bord',
    icon: <Home className="h-4 w-4" />
  },
  {
    keys: ['Alt', '2'],
    description: 'Bétail',
    icon: <Users className="h-4 w-4" />
  },
  {
    keys: ['Alt', '3'],
    description: 'Zones',
    icon: <Home className="h-4 w-4" />
  },
  {
    keys: ['Alt', '4'],
    description: 'Finances',
    icon: <DollarSign className="h-4 w-4" />
  },
  {
    keys: ['Alt', '5'],
    description: 'Stocks',
    icon: <Bell className="h-4 w-4" />
  },
  {
    keys: ['Escape'],
    description: 'Fermer les modales',
    icon: <X className="h-4 w-4" />
  }
]

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + / pour ouvrir l'aide
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault()
        setIsOpen(true)
      }
      
      // Échapper pour fermer
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Keyboard className="mr-2 h-5 w-5" />
            Raccourcis clavier
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700">
                <div className="flex-shrink-0 text-gray-400">
                  {shortcut.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{shortcut.description}</p>
                </div>
                <div className="flex space-x-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <div key={keyIndex} className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs bg-gray-600 border-gray-500 text-gray-300">
                        {key}
                      </Badge>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="text-gray-400 text-xs">+</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 text-center">
              💡 <strong>Astuce:</strong> Appuyez sur <Badge variant="outline" className="text-xs bg-gray-600 border-gray-500 text-gray-300">Ctrl</Badge> + <Badge variant="outline" className="text-xs bg-gray-600 border-gray-500 text-gray-300">/</Badge> à tout moment pour ouvrir cette aide
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}