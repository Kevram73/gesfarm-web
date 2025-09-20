/**
 * Script simple pour tester la connectivité avec l'API
 * Exécutez avec: node test-connectivity.js
 */

const https = require('https');

const API_URL = 'https://farm.pressingelegance.com/api';

function testConnectivity() {
  console.log('🔍 Test de connectivité avec l\'API...\n');
  console.log(`URL: ${API_URL}`);
  
  const startTime = Date.now();
  
  const options = {
    hostname: 'farm.pressingelegance.com',
    port: 443,
    path: '/api',
    method: 'GET',
    timeout: 10000,
    headers: {
      'User-Agent': 'GesFarm-Test/1.0',
      'Accept': 'application/json',
    }
  };

  const req = https.request(options, (res) => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✅ Connexion réussie!`);
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Temps de réponse: ${responseTime}ms`);
    console.log(`   Headers CORS:`);
    console.log(`     - Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'Non défini'}`);
    console.log(`     - Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || 'Non défini'}`);
    console.log(`     - Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers'] || 'Non défini'}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`   Taille de la réponse: ${data.length} caractères`);
      if (data.length < 500) {
        console.log(`   Contenu: ${data}`);
      }
    });
  });

  req.on('error', (error) => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`❌ Erreur de connexion:`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Code: ${error.code}`);
    console.log(`   Temps écoulé: ${responseTime}ms`);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log(`   → Timeout détecté - Le serveur met trop de temps à répondre`);
    } else if (error.code === 'ENOTFOUND') {
      console.log(`   → DNS non résolu - Vérifiez l'URL du serveur`);
    } else if (error.code === 'ECONNREFUSED') {
      console.log(`   → Connexion refusée - Le serveur n'est pas accessible`);
    }
  });

  req.on('timeout', () => {
    console.log(`⏰ Timeout de la requête (10s)`);
    req.destroy();
  });

  req.end();
}

// Test de résolution DNS
console.log('🌐 Test de résolution DNS...');
const dns = require('dns');
dns.lookup('farm.pressingelegance.com', (err, address, family) => {
  if (err) {
    console.log(`❌ Erreur DNS: ${err.message}`);
  } else {
    console.log(`✅ DNS résolu: ${address} (IPv${family})`);
  }
  console.log('');
  
  // Lancer le test de connectivité
  testConnectivity();
});
