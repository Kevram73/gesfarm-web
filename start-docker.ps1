# Script PowerShell pour démarrer GESFARM avec Docker
Write-Host "🚀 Démarrage GESFARM avec Docker" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "📦 Construction des images..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host "🛑 Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose down

Write-Host "🚀 Démarrage des services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "⏳ Attente du démarrage des services (30 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "📊 Statut des conteneurs:" -ForegroundColor Cyan
docker-compose ps

Write-Host "🧪 Test de connectivité:" -ForegroundColor Cyan
Write-Host "Test 1: Frontend" -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Frontend accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Test 2: Backend API" -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/dashboard" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Backend API accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Test 3: Base de données" -ForegroundColor White
try {
    docker-compose exec db mysql -u gesfarm_user -pgesfarm_password -e "SELECT 1;" gesfarm
    Write-Host "✅ Base de données accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Base de données non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Démarrage terminé!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 Backend API: http://localhost:8000/api" -ForegroundColor Cyan
Write-Host "🗄️ phpMyAdmin: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Logs en temps réel:" -ForegroundColor Yellow
Write-Host "docker-compose logs -f" -ForegroundColor Gray