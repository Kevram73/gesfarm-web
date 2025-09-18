"use client"

import { NoSSR } from "../client-only"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/" }: AuthGuardProps) {
  // Pour l'instant, on affiche directement le contenu pour éviter les problèmes d'hydratation
  // L'authentification sera gérée côté client
  return (
    <NoSSR fallback={<div>Chargement...</div>}>
      {children}
    </NoSSR>
  )
}
