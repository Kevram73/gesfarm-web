"use client"

import { Button } from "@/lib/components/ui/button"
import { Menu, Settings, HelpCircle, MoreVertical } from "lucide-react"
import { LogoutButton } from "@/lib/components/auth/logout-button"
import { NotificationDropdown } from "@/lib/components/ui/notification-dropdown"
import { UserProfileDropdown } from "@/lib/components/ui/user-profile-dropdown"
import { SearchBar } from "@/lib/components/ui/search-bar"
import { SystemStatus } from "@/lib/components/ui/system-status"
import { DarkModeToggle } from "@/lib/components/ui/dark-mode-toggle"
import { LiveMetrics } from "@/lib/components/ui/live-metrics"
import { QuickActions } from "@/lib/components/ui/quick-actions"
import { ConnectionStatus } from "@/lib/components/ui/connection-status"
import { useAuth } from "@/lib/hooks/use-auth-global"
import { useState } from "react"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-700 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60 shadow-lg">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-3 hover:bg-gray-700 transition-colors"
          onClick={onMenuClick}
          title="Menu principal"
        >
          <Menu className="h-5 w-5 text-gray-300" />
        </Button>
        
        {/* Logo/Brand */}
        <div className="hidden md:flex items-center mr-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
            <span className="text-sm font-bold text-white">G</span>
          </div>
          <span className="text-lg font-semibold text-white">GESFARM</span>
        </div>
        
        {/* Search bar */}
        <SearchBar />
        
        {/* Right side actions */}
        <div className="flex items-center space-x-1">
          {/* Help - Hidden on mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex hover:bg-gray-700 transition-colors"
            title="Aide"
          >
            <HelpCircle className="h-4 w-4 text-gray-300" />
          </Button>

          {/* Quick Actions */}
          <QuickActions />

          {/* Theme Toggle */}
          <DarkModeToggle />

          {/* Settings - Hidden on mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex hover:bg-gray-700 transition-colors"
            title="Paramètres"
          >
            <Settings className="h-4 w-4 text-gray-300" />
          </Button>
          
          {/* Live Metrics */}
          <LiveMetrics />
          
          {/* Connection Status */}
          <ConnectionStatus />
          
          {/* System Status */}
          <SystemStatus />
          
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* User profile dropdown */}
          <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-600">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium text-white">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
              {user?.roles && user.roles.length > 0 && (
                <p className="text-xs text-blue-400">{user.roles.join(', ')}</p>
              )}
            </div>
            <UserProfileDropdown />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-700 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              title="Menu mobile"
            >
              <MoreVertical className="h-4 w-4 text-gray-300" />
            </Button>
          </div>

          {/* Logout - Hidden on small screens */}
          <div className="hidden sm:block">
            <LogoutButton 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700 transition-colors ml-1"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-700 bg-gray-800">
          <div className="px-4 py-2 space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => {
                setShowMobileMenu(false)
                // TODO: Naviguer vers aide
              }}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Aide
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => {
                setShowMobileMenu(false)
                // TODO: Naviguer vers paramètres
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
            <div className="border-t border-gray-700 pt-2">
              <LogoutButton 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
