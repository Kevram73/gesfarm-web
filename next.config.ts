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
}

module.exports = nextConfig