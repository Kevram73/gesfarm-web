import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://farm.pressingelegance.com/api'

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request, 'PATCH')
}

export async function OPTIONS(request: NextRequest) {
  // Gérer les requêtes preflight
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  })
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    // Extraire le chemin de l'URL
    const url = new URL(request.url)
    const path = url.pathname.replace('/api/proxy', '')
    const targetUrl = `${API_BASE_URL}${path}`
    
    // Préparer les headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }
    
    // Copier l'Authorization header si présent
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    // Préparer le body pour les requêtes POST/PUT/PATCH
    let body: string | undefined
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const requestBody = await request.text()
        body = requestBody
      } catch (error) {
        console.error('Erreur lors de la lecture du body:', error)
      }
    }
    
    // Faire la requête vers l'API Laravel
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      // Ajouter les credentials si nécessaire
      credentials: 'include',
    })
    
    // Lire la réponse
    const responseData = await response.text()
    
    // Créer la réponse avec les headers CORS appropriés
    const nextResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
    })
    
    // Ajouter les headers CORS
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true')
    
    // Copier les headers de contenu de la réponse originale
    const contentType = response.headers.get('content-type')
    if (contentType) {
      nextResponse.headers.set('Content-Type', contentType)
    }
    
    return nextResponse
    
  } catch (error) {
    console.error('Erreur du proxy API:', error)
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Erreur du serveur proxy',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    )
  }
}
