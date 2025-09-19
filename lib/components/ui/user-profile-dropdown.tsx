"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { User, Settings, LogOut, Shield, Mail, Calendar } from "lucide-react"
import { useAuthData } from "@/lib/hooks/use-auth-global"
import { LogoutButton } from "@/lib/components/auth/logout-button"

export function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuthData()

  if (!user) return null

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="Profil utilisateur"
      >
        <User className="h-4 w-4 text-gray-300" />
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-80 z-50 bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profil utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations utilisateur */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Rôles */}
              {user.roles && user.roles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Rôles</p>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="text-xs bg-blue-600 border-blue-500 text-white"
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Permissions */}
              {user.permissions && user.permissions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.slice(0, 3).map((permission, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="text-xs bg-gray-600 border-gray-500 text-gray-300"
                      >
                        {permission}
                      </Badge>
                    ))}
                    {user.permissions.length > 3 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-gray-600 border-gray-500 text-gray-300"
                      >
                        +{user.permissions.length - 3} autres
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="border-t border-gray-700 pt-3 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Mail className="h-3 w-3" />
                  <span>ID: {user.id}</span>
                </div>
                {user.last_login && (
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>Dernière connexion: {new Date(user.last_login).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-700 pt-3 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                
                <LogoutButton 
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}