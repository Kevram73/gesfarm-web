"use client"

import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Badge } from "@/lib/components/ui/badge"
import { Search, Bell, User, Menu } from "lucide-react"
import { LogoutButton } from "@/lib/components/auth/logout-button"
import { useAuthData } from "@/lib/hooks/use-auth-global"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthData()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 hover:bg-gray-100"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        
        {/* Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
            <Bell className="h-4 w-4 text-gray-600" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500"
            >
              3
            </Badge>
          </Button>
          
          {/* User profile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-100"
            onClick={() => window.location.href = '/profile'}
            title={user?.name || 'Profil'}
          >
            <User className="h-4 w-4 text-gray-600" />
          </Button>

          {/* Logout */}
          <LogoutButton 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          />
        </div>
      </div>
    </header>
  )
}
