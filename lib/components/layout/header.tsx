"use client"

import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Badge } from "@/lib/components/ui/badge"
import { Search, Bell, User, Menu } from "lucide-react"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Button
            variant="ghost"
            className="mr-2 px-0 hover:bg-gray-700"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 md:w-[100px] lg:w-[300px] border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="relative hover:bg-gray-700">
                          <Bell className="h-4 w-4 text-gray-300" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500"
              >
                3
              </Badge>
            </Button>
            
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-gray-700"
                          onClick={() => window.location.href = '/profile'}
                        >
                          <User className="h-4 w-4 text-gray-300" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
