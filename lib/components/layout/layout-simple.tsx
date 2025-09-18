"use client"

import dynamic from "next/dynamic"

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
  return (
    <div className="min-h-screen bg-gray-900">
      <DynamicHeader onMenuClick={() => {}} />
      
      <div className="flex">
        {/* Sidebar desktop */}
        <div className="hidden md:block w-64 bg-gray-800 border-r border-gray-700">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <DynamicSidebar />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-900">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
