/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Configuration de base
  trailingSlash: false,
  // Désactiver complètement l'export statique
  output: 'standalone',
  // Désactiver la génération de pages d'erreur statiques
  generateEtags: false,
  
  // Configuration CORS pour les requêtes API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://farm.pressingelegance.com/api/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        // Appliquer ces headers à toutes les routes
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // En production, spécifiez votre domaine exact
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig