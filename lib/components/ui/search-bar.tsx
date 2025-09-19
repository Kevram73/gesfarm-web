"use client"

import { useState, useEffect } from "react"
import { Input } from "@/lib/components/ui/input"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent } from "@/lib/components/ui/card"
import { Search, X, Clock, TrendingUp } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  type: 'cattle' | 'zone' | 'financial' | 'user'
  description: string
  url: string
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Vache #001 - Bella',
    type: 'cattle',
    description: 'Vache Holstein, 450kg, Zone Nord',
    url: '/cattle/details/1'
  },
  {
    id: '2',
    title: 'Zone Nord',
    type: 'zone',
    description: 'Zone de pâturage principal, 50 hectares',
    url: '/zones/details/1'
  },
  {
    id: '3',
    title: 'Ventes de lait - Décembre',
    type: 'financial',
    description: 'Transaction financière, +2,500€',
    url: '/financial/transactions/1'
  }
]

const recentSearches = [
  'Vaches Holstein',
  'Zone Nord',
  'Ventes décembre'
]

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true)
      // Simuler une recherche
      setTimeout(() => {
        const filteredResults = mockSearchResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filteredResults)
        setIsSearching(false)
      }, 300)
    } else {
      setResults([])
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      console.log("Recherche:", query)
      // TODO: Implémenter la navigation vers les résultats
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setQuery("")
    setIsOpen(false)
    window.location.href = result.url
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cattle':
        return '🐄'
      case 'zone':
        return '🌾'
      case 'financial':
        return '💰'
      case 'user':
        return '👤'
      default:
        return '📄'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cattle':
        return 'text-green-500'
      case 'zone':
        return 'text-blue-500'
      case 'financial':
        return 'text-yellow-500'
      case 'user':
        return 'text-purple-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="relative flex-1 max-w-lg mx-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher du bétail, zones, finances..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:bg-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-all"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-white"
            onClick={() => {
              setQuery("")
              setIsOpen(false)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Results */}
          <Card className="absolute top-12 left-0 right-0 z-50 bg-gray-800 border-gray-700 shadow-xl max-h-96 overflow-hidden">
            <CardContent className="p-0">
              {query.length === 0 ? (
                /* Recent Searches */
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">Recherches récentes</span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => {
                          setQuery(search)
                          setIsOpen(true)
                        }}
                      >
                        <Search className="mr-2 h-3 w-3" />
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : query.length <= 2 ? (
                /* Typing indicator */
                <div className="p-4 text-center text-gray-400">
                  <p className="text-sm">Tapez au moins 3 caractères pour rechercher</p>
                </div>
              ) : isSearching ? (
                /* Loading */
                <div className="p-4 text-center text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm">Recherche en cours...</p>
                </div>
              ) : results.length > 0 ? (
                /* Results */
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {results.map((result) => (
                      <Button
                        key={result.id}
                        variant="ghost"
                        className="w-full justify-start text-left p-3 hover:bg-gray-700"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <span className="text-lg flex-shrink-0 mt-0.5">
                            {getTypeIcon(result.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {result.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {result.description}
                            </p>
                            <span className={`text-xs ${getTypeColor(result.type)}`}>
                              {result.type}
                            </span>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                /* No results */
                <div className="p-4 text-center text-gray-400">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun résultat trouvé pour "{query}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
