"use client"

import { useState, useEffect } from "react"
import { Button } from "@/lib/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"

type Theme = 'light' | 'dark' | 'system'

export function DarkModeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Récupérer le thème depuis localStorage
    const savedTheme = localStorage.getItem('gesfarm-theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Sauvegarder le thème
    localStorage.setItem('gesfarm-theme', theme)
    
    // Appliquer le thème
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [theme, mounted])

  const cycleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'dark':
          return 'light'
        case 'light':
          return 'system'
        case 'system':
          return 'dark'
        default:
          return 'dark'
      }
    })
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Moon className="h-4 w-4" />
    }
  }

  const getTitle = () => {
    switch (theme) {
      case 'light':
        return 'Thème clair'
      case 'dark':
        return 'Thème sombre'
      case 'system':
        return 'Thème système'
      default:
        return 'Thème sombre'
    }
  }

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:bg-gray-700 transition-colors"
        title="Changer le thème"
      >
        <Moon className="h-4 w-4 text-gray-300" />
      </Button>
    )
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="hover:bg-gray-700 transition-colors"
      onClick={cycleTheme}
      title={getTitle()}
    >
      {getIcon()}
    </Button>
  )
}