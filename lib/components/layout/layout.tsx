"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background farm-theme">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {/* Sidebar */}
                    <div className={`
                      fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-800 border-r border-gray-700 shadow-lg transition-transform duration-300 ease-in-out
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                      md:translate-x-0 md:static md:inset-0
                    `}>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <Sidebar />
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

                    {/* Main content */}
                    <main className="flex-1 md:ml-0 bg-gray-900">
                      <div className="container mx-auto p-6">
                        {children}
                      </div>
                    </main>
      </div>
    </div>
  )
}
