/**
 * Script de test pour vérifier la configuration CORS
 * Exécutez ce script avec: node test-cors.js
 */

const axios = require('axios');

// Configuration de test
const API_BASE_URL = 'http://62.171.181.213:8000/api';
const TEST_ENDPOINTS = [
  '/auth/me',
  '/dashboard/stats',
  '/users',
];

async function testCorsConfiguration() {
  console.log('🔍 Test de la configuration CORS...\n');
  
  for (const endpoint of TEST_ENDPOINTS) {
    console.log(`📡 Test de l'endpoint: ${endpoint}`);
    
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      });
      
      console.log(`✅ Succès: ${response.status} - ${response.statusText}`);
      console.log(`   Headers CORS reçus:`, {
        'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': response.headers['access-control-allow-headers'],
      });
      
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
      
      if (error.code === 'ERR_NETWORK') {
        console.log('   → Problème de réseau ou CORS');
      } else if (error.response) {
        console.log(`   → Status: ${error.response.status}`);
        console.log(`   → Headers CORS:`, {
          'Access-Control-Allow-Origin': error.response.headers['access-control-allow-origin'],
          'Access-Control-Allow-Methods': error.response.headers['access-control-allow-methods'],
        });
      }
    }
    
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  // Test d'une requête OPTIONS (preflight)
  console.log('🔄 Test de requête OPTIONS (preflight)...');
  try {
    const response = await axios.options(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
      },
    });
    
    console.log(`✅ Preflight réussi: ${response.status}`);
    console.log(`   Headers CORS:`, {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers'],
    });
    
  } catch (error) {
    console.log(`❌ Preflight échoué: ${error.message}`);
  }
  
  console.log('\n🏁 Test terminé!');
}

// Exécuter le test
testCorsConfiguration().catch(console.error);
