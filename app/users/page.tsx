"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { useUsers } from "@/lib/hooks/use-users"
import { Users, Mail, Phone, Globe, MapPin, Building } from "lucide-react"

export default function UsersPage() {
  const { data: users, isLoading, error } = useUsers()

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
            <p className="text-muted-foreground">
              Gestion des utilisateurs de l'application.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                    <div className="h-3 bg-muted rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
            <p className="text-muted-foreground">
              Gestion des utilisateurs de l'application.
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-destructive">Erreur lors du chargement des utilisateurs</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
            <p className="text-muted-foreground">
              Gestion des utilisateurs de l'application.
            </p>
          </div>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              <Badge variant="secondary">En ligne</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor((users?.length || 0) * 0.7)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
              <Badge variant="outline">+12</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de rétention</CardTitle>
              <Badge variant="default">94%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <Badge variant="outline">ID: {user.id}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{user.website}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.address.city}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{user.company.name}</span>
                </div>
                <div className="pt-2 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Modifier
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
