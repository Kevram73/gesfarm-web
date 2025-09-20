/**
 * Script de test pour le proxy API Next.js
 * Teste les endpoints via le proxy pour éviter les problèmes CORS
 */

const https = require('https');

const PROXY_BASE_URL = 'https://gesfarm-web.vercel.app/api/proxy';
const TEST_ENDPOINTS = [
  { name: 'Login Test', endpoint: '/login', method: 'POST', data: { email: 'test@example.com', password: 'test' } },
  { name: 'Auth Profile', endpoint: '/auth/profile', method: 'GET' },
  { name: 'Dashboard Stats', endpoint: '/dashboard/stats', method: 'GET' },
  { name: 'Users List', endpoint: '/users', method: 'GET' },
];

async function testProxyEndpoint(endpoint, method, name, data) {
  console.log(`📡 Test: ${name} (${method} ${endpoint})`);
  
  const url = new URL(PROXY_BASE_URL + endpoint);
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'GesFarm-Proxy-Test/1.0',
    }
  };

  if (data && method === 'POST') {
    const postData = JSON.stringify(data);
    options.headers['Content-Length'] = Buffer.byteLength(postData);
  }

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Headers CORS:`);
        console.log(`     - Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || '❌ MANQUANT'}`);
        console.log(`     - Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || '❌ MANQUANT'}`);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`   ✅ Succès`);
        } else if (res.statusCode === 401 || res.statusCode === 422) {
          console.log(`   ⚠️  Réponse attendue (authentification requise)`);
        } else {
          console.log(`   ❌ Erreur inattendue`);
        }
        
        if (responseData.length < 200) {
          console.log(`   Réponse: ${responseData.substring(0, 100)}...`);
        }
        
        resolve({ status: res.statusCode, data: responseData });
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Erreur: ${error.message}`);
      resolve({ error: error.message });
    });

    req.on('timeout', () => {
      console.log(`   ⏰ Timeout`);
      req.destroy();
      resolve({ error: 'timeout' });
    });

    if (data && method === 'POST') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testProxyConnectivity() {
  console.log('🔍 Test de connectivité via le proxy Next.js...\n');
  console.log(`Proxy URL: ${PROXY_BASE_URL}\n`);
  
  const results = [];
  
  for (const test of TEST_ENDPOINTS) {
    const result = await testProxyEndpoint(test.endpoint, test.method, test.name, test.data);
    results.push({ ...test, result });
    console.log(''); // Ligne vide
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Résumé
  console.log('📊 Résumé des tests:');
  const successful = results.filter(r => r.result.status >= 200 && r.result.status < 300).length;
  const authRequired = results.filter(r => r.result.status === 401 || r.result.status === 422).length;
  const errors = results.filter(r => r.result.error || (r.result.status >= 400 && r.result.status !== 401 && r.result.status !== 422)).length;
  
  console.log(`   ✅ Succès: ${successful}`);
  console.log(`   ⚠️  Auth requise: ${authRequired}`);
  console.log(`   ❌ Erreurs: ${errors}`);
  
  if (successful > 0 || authRequired > 0) {
    console.log('\n🎉 Le proxy fonctionne correctement!');
    console.log('   Les requêtes passent bien par le proxy Next.js');
    console.log('   Les erreurs 401/422 sont normales (authentification requise)');
  } else {
    console.log('\n❌ Problème avec le proxy');
    console.log('   Vérifiez que l\'application est déployée sur Vercel');
    console.log('   Vérifiez que le proxy API est accessible');
  }
  
  console.log('\n🏁 Tests terminés!');
}

// Test de connectivité de base
function testBasicConnectivity() {
  console.log('🌐 Test de connectivité de base...');
  
  const options = {
    hostname: 'gesfarm-web.vercel.app',
    port: 443,
    path: '/api/proxy',
    method: 'GET',
    headers: {
      'User-Agent': 'GesFarm-Proxy-Test/1.0',
    }
  };

  const req = https.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    if (res.statusCode === 200 || res.statusCode === 404) {
      console.log('   ✅ Proxy accessible');
      // Lancer les tests détaillés
      testProxyConnectivity();
    } else {
      console.log('   ❌ Proxy non accessible');
    }
  });

  req.on('error', (error) => {
    console.log(`   ❌ Erreur: ${error.message}`);
    console.log('   Vérifiez que l\'application est déployée sur Vercel');
  });

  req.end();
}

// Démarrer les tests
testBasicConnectivity();
