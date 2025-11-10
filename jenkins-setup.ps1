# Jenkins Setup Script for Lotus Platform (Windows PowerShell)
# This script sets up Jenkins in a Docker container with all necessary configurations

Write-Host "🚀 Starting Jenkins Setup for Lotus Platform..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Stop and remove existing Jenkins container if it exists
$existingContainer = docker ps -a --format "{{.Names}}" | Select-String "^jenkins-lotus$"
if ($existingContainer) {
    Write-Host "⚠️  Existing jenkins-lotus container found. Removing..." -ForegroundColor Yellow
    docker stop jenkins-lotus 2>$null
    docker rm jenkins-lotus 2>$null
}

# Create Docker volume for Jenkins data persistence
Write-Host "📦 Creating Docker volume for Jenkins data..." -ForegroundColor Cyan
docker volume create jenkins_home

# Launch Jenkins container
Write-Host "🐳 Launching Jenkins container..." -ForegroundColor Cyan
docker run -d `
  --name jenkins-lotus `
  --restart unless-stopped `
  -p 8080:8080 `
  -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v //var/run/docker.sock:/var/run/docker.sock `
  jenkins/jenkins:lts-jdk11

# Wait for Jenkins to start
Write-Host "⏳ Waiting for Jenkins to start (this may take a minute)..." -ForegroundColor Yellow
Start-Sleep -Seconds 45

# Check if container is running
$runningContainer = docker ps --format "{{.Names}}" | Select-String "^jenkins-lotus$"
if ($runningContainer) {
    Write-Host "✅ Jenkins container is running!" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Jenkins container failed to start" -ForegroundColor Red
    docker logs jenkins-lotus
    exit 1
}

# Retrieve initial admin password
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🔑 Jenkins Initial Administrator Password:" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
docker exec jenkins-lotus cat /var/jenkins_home/secrets/initialAdminPassword
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Jenkins Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open your browser and navigate to: http://localhost:8080" -ForegroundColor White
Write-Host "2. Use the password above to unlock Jenkins" -ForegroundColor White
Write-Host "3. Install suggested plugins" -ForegroundColor White
Write-Host "4. Create your admin user account" -ForegroundColor White
Write-Host ""
Write-Host "📝 Save this password securely - you'll need it shortly!" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 To view Jenkins logs, run: docker logs -f jenkins-lotus" -ForegroundColor Cyan
Write-Host ""
