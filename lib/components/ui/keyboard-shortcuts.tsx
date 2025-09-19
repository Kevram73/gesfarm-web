"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si l'utilisateur tape dans un input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Ctrl/Cmd + K pour la recherche
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Ctrl/Cmd + / pour l'aide
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault()
        // TODO: Ouvrir l'aide
        console.log("Ouvrir l'aide")
      }

      // Ctrl/Cmd + , pour les paramètres
      if ((event.ctrlKey || event.metaKey) && event.key === ',') {
        event.preventDefault()
        // TODO: Ouvrir les paramètres
        console.log("Ouvrir les paramètres")
      }

      // Échapper pour fermer les modales
      if (event.key === 'Escape') {
        // Fermer tous les dropdowns ouverts
        const dropdowns = document.querySelectorAll('[data-dropdown="true"]')
        dropdowns.forEach(dropdown => {
          dropdown.classList.add('hidden')
        })
      }

      // Navigation rapide avec les touches
      if (event.altKey) {
        switch (event.key) {
          case '1':
            event.preventDefault()
            router.push('/dashboard')
            break
          case '2':
            event.preventDefault()
            router.push('/cattle')
            break
          case '3':
            event.preventDefault()
            router.push('/zones')
            break
          case '4':
            event.preventDefault()
            router.push('/financial')
            break
          case '5':
            event.preventDefault()
            router.push('/stocks')
            break
          case '6':
            event.preventDefault()
            router.push('/users')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])

  return null // Ce composant ne rend rien
}