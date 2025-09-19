// Script de test pour vérifier l'authentification
// À exécuter dans la console du navigateur

console.log("=== Test d'authentification GESFARM ===");

// Vérifier le localStorage
const token = localStorage.getItem("gesfarm_token");
const user = localStorage.getItem("gesfarm_user");

console.log("Token:", token ? "✅ Présent" : "❌ Absent");
console.log("User:", user ? "✅ Présent" : "❌ Absent");

if (user) {
  try {
    const userObj = JSON.parse(user);
    console.log("Utilisateur:", userObj);
  } catch (e) {
    console.error("Erreur parsing user:", e);
  }
}

// Simuler une connexion
function simulateLogin() {
  const fakeToken = "fake-token-" + Date.now();
  const fakeUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    role: "admin"
  };
  
  localStorage.setItem("gesfarm_token", fakeToken);
  localStorage.setItem("gesfarm_user", JSON.stringify(fakeUser));
  
  console.log("✅ Connexion simulée");
  console.log("Rechargez la page pour voir les changements");
}

// Simuler une déconnexion
function simulateLogout() {
  localStorage.removeItem("gesfarm_token");
  localStorage.removeItem("gesfarm_user");
  
  console.log("✅ Déconnexion simulée");
  console.log("Rechargez la page pour voir les changements");
}

// Fonctions disponibles dans la console
console.log("Fonctions disponibles:");
console.log("- simulateLogin() : Simuler une connexion");
console.log("- simulateLogout() : Simuler une déconnexion");
