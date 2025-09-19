"use client"

import { Heart, Github, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">G</span>
              </div>
              <span className="text-xl font-bold text-white">GESFARM</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Système de gestion d'exploitation agropastorale moderne et efficace. 
              Gérez votre bétail, vos zones, vos finances et bien plus encore.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Fait avec</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>pour les agriculteurs</span>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Tableau de bord
                </a>
              </li>
              <li>
                <a href="/cattle" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Gestion du bétail
                </a>
              </li>
              <li>
                <a href="/zones" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Zones de pâturage
                </a>
              </li>
              <li>
                <a href="/financial" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Finances
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@gesfarm.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Github className="h-4 w-4" />
                <a href="#" className="hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 GESFARM. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Aide
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}