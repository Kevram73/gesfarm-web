"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Breadcrumb } from "@/lib/components/ui/breadcrumb"
import { KeyboardShortcuts } from "@/lib/components/ui/keyboard-shortcuts"
import { ToastContainer } from "@/lib/components/ui/toast"
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay"
import { Footer } from "./footer"
import { KeyboardShortcutsHelp } from "@/lib/components/ui/keyboard-shortcuts-help"
import { ErrorBoundary } from "@/lib/components/ui/error-boundary"

// Import dynamique pour éviter les problèmes d'hydratation
const DynamicSidebar = dynamic(() => import("./sidebar").then(mod => ({ default: mod.Sidebar })), {
  ssr: false,
  loading: () => <div className="w-64 bg-gray-800 border-r border-gray-700" />
})

const DynamicHeader = dynamic(() => import("./header").then(mod => ({ default: mod.Header })), {
  ssr: false,
  loading: () => <div className="h-16 bg-gray-800" />
})

interface LayoutProps {
  children: React.ReactNode
}

export function LayoutSimple({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <DynamicHeader onMenuClick={toggleSidebar} />
      
      <div className="flex">
        {/* Sidebar mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-70 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <DynamicSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-900 min-h-screen flex flex-col">
          <div className="p-6 flex-1">
            <Breadcrumb />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
          <Footer />
        </main>
      </div>
      
      {/* Keyboard shortcuts */}
      <KeyboardShortcuts />
      
      {/* Toast container */}
      <ToastContainer />
      
      {/* Loading overlay */}
      <LoadingOverlay isLoading={isLoading} message="Chargement..." />
      
      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsHelp />
      </div>
    </ErrorBoundary>
  )
}
