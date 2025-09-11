"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { FileText, Search, Plus, Download, Eye, Edit, Trash2 } from "lucide-react"

const documents = [
  {
    id: 1,
    name: "Rapport mensuel - Janvier 2024",
    type: "PDF",
    size: "2.4 MB",
    date: "2024-01-15",
    status: "publié"
  },
  {
    id: 2,
    name: "Présentation Q1 2024",
    type: "PPTX",
    size: "5.1 MB",
    date: "2024-01-10",
    status: "brouillon"
  },
  {
    id: 3,
    name: "Contrat client ABC",
    type: "DOCX",
    size: "1.2 MB",
    date: "2024-01-08",
    status: "en révision"
  },
  {
    id: 4,
    name: "Analyse de marché",
    type: "XLSX",
    size: "3.7 MB",
    date: "2024-01-05",
    status: "publié"
  },
  {
    id: 5,
    name: "Politique de confidentialité",
    type: "PDF",
    size: "890 KB",
    date: "2024-01-03",
    status: "publié"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "publié":
      return "bg-green-500"
    case "brouillon":
      return "bg-yellow-500"
    case "en révision":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

export default function DocumentsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Gestion de vos documents et fichiers.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau document
          </Button>
        </div>

        {/* Search and filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline">Filtrer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{doc.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(doc.status)} text-white`}
                  >
                    {doc.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Créé le {new Date(doc.date).toLocaleDateString("fr-FR")}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-1 h-3 w-3" />
                      Télécharger
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
