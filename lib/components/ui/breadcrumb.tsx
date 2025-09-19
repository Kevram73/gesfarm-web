"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

const routeLabels: Record<string, string> = {
  'dashboard': 'Tableau de bord',
  'cattle': 'Bétail',
  'zones': 'Zones',
  'poultry': 'Volaille',
  'crops': 'Cultures',
  'users': 'Utilisateurs',
  'financial': 'Finances',
  'stocks': 'Stocks',
  'add': 'Ajouter',
  'edit': 'Modifier',
  'details': 'Détails',
  'create': 'Créer'
}

export function Breadcrumb() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Accueil', href: '/dashboard' }
    ]

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Skip numeric segments (IDs)
      if (!isNaN(Number(segment))) {
        return
      }

      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumbs.push({
        label,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-400 mb-4">
      <Link 
        href="/dashboard" 
        className="flex items-center hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbs.slice(1).map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4 text-gray-500" />
          {index === breadcrumbs.length - 2 ? (
            <span className="text-white font-medium">{breadcrumb.label}</span>
          ) : (
            <Link 
              href={breadcrumb.href}
              className="hover:text-white transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
