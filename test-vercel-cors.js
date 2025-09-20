/**
 * Script de test CORS spécifique pour le déploiement Vercel
 * Teste depuis le domaine Vercel vers l'API Laravel
 */

const https = require('https');

const API_BASE_URL = 'https://farm.pressingelegance.com/api';
const VERCEL_DOMAIN = 'https://gesfarm-web.vercel.app';

console.log('🔍 Test CORS depuis Vercel vers l\'API Laravel...\n');
console.log(`Domaine Vercel: ${VERCEL_DOMAIN}`);
console.log(`API Laravel: ${API_BASE_URL}\n`);

// Test 1: Requête OPTIONS (preflight)
function testPreflightRequest() {
  console.log('📡 Test 1: Requête OPTIONS (preflight)...');
  
  const options = {
    hostname: 'farm.pressingelegance.com',
    port: 443,
    path: '/api/login',
    method: 'OPTIONS',
    headers: {
      'Origin': VERCEL_DOMAIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization, X-Requested-With',
      'User-Agent': 'GesFarm-Vercel-Test/1.0',
    }
  };

  const req = https.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Headers CORS:`);
    console.log(`     - Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || '❌ MANQUANT'}`);
    console.log(`     - Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || '❌ MANQUANT'}`);
    console.log(`     - Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers'] || '❌ MANQUANT'}`);
    console.log(`     - Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials'] || '❌ MANQUANT'}`);
    
    if (res.statusCode === 200 && res.headers['access-control-allow-origin']) {
      console.log('   ✅ Preflight réussi');
    } else {
      console.log('   ❌ Preflight échoué');
    }
    
    // Passer au test suivant
    setTimeout(testPostRequest, 1000);
  });

  req.on('error', (error) => {
    console.log(`   ❌ Erreur: ${error.message}`);
    setTimeout(testPostRequest, 1000);
  });

  req.end();
}

// Test 2: Requête POST (réelle)
function testPostRequest() {
  console.log('\n📡 Test 2: Requête POST (réelle)...');
  
  const postData = JSON.stringify({
    email: 'test@example.com',
    password: 'testpassword'
  });

  const options = {
    hostname: 'farm.pressingelegance.com',
    port: 443,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Origin': VERCEL_DOMAIN,
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'GesFarm-Vercel-Test/1.0',
    }
  };

  const req = https.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Headers CORS:`);
    console.log(`     - Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || '❌ MANQUANT'}`);
    console.log(`     - Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials'] || '❌ MANQUANT'}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 422) {
        console.log('   ✅ Requête POST réussie (réponse du serveur)');
      } else {
        console.log(`   ⚠️  Status inattendu: ${res.statusCode}`);
      }
      
      if (data.length < 500) {
        console.log(`   Réponse: ${data.substring(0, 200)}...`);
      }
      
      // Test final
      setTimeout(testCorsHeaders, 1000);
    });
  });

  req.on('error', (error) => {
    console.log(`   ❌ Erreur: ${error.message}`);
    setTimeout(testCorsHeaders, 1000);
  });

  req.write(postData);
  req.end();
}

// Test 3: Vérification des headers CORS
function testCorsHeaders() {
  console.log('\n📡 Test 3: Vérification des headers CORS...');
  
  const options = {
    hostname: 'farm.pressingelegance.com',
    port: 443,
    path: '/api',
    method: 'GET',
    headers: {
      'Origin': VERCEL_DOMAIN,
      'User-Agent': 'GesFarm-Vercel-Test/1.0',
    }
  };

  const req = https.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Headers CORS:`);
    
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-allow-credentials',
      'access-control-max-age'
    ];
    
    corsHeaders.forEach(header => {
      const value = res.headers[header];
      if (value) {
        console.log(`     - ${header}: ✅ ${value}`);
      } else {
        console.log(`     - ${header}: ❌ MANQUANT`);
      }
    });
    
    console.log('\n🏁 Tests terminés!');
    
    // Recommandations
    console.log('\n💡 Recommandations:');
    if (!res.headers['access-control-allow-origin']) {
      console.log('   ❌ Access-Control-Allow-Origin manquant - C\'est le problème principal!');
      console.log('   🔧 Vérifiez la configuration CORS du serveur Laravel');
    } else if (res.headers['access-control-allow-origin'] !== '*' && 
               res.headers['access-control-allow-origin'] !== VERCEL_DOMAIN) {
      console.log('   ⚠️  Access-Control-Allow-Origin ne correspond pas au domaine Vercel');
      console.log(`   🔧 Attendu: ${VERCEL_DOMAIN}`);
      console.log(`   🔧 Reçu: ${res.headers['access-control-allow-origin']}`);
    } else {
      console.log('   ✅ Configuration CORS semble correcte');
      console.log('   🔍 Le problème pourrait être ailleurs (middleware, cache, etc.)');
    }
  });

  req.on('error', (error) => {
    console.log(`   ❌ Erreur: ${error.message}`);
    console.log('\n🏁 Tests terminés avec erreur!');
  });

  req.end();
}

// Démarrer les tests
testPreflightRequest();
