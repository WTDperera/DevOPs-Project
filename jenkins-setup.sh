#!/bin/bash

# Jenkins Setup Script for Lotus Platform
# This script sets up Jenkins in a Docker container with all necessary configurations

echo "🚀 Starting Jenkins Setup for Lotus Platform..."
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Stop and remove existing Jenkins container if it exists
if docker ps -a --format '{{.Names}}' | grep -q "^jenkins-lotus$"; then
    echo "⚠️  Existing jenkins-lotus container found. Removing..."
    docker stop jenkins-lotus 2>/dev/null
    docker rm jenkins-lotus 2>/dev/null
fi

# Create Docker volume for Jenkins data persistence
echo "📦 Creating Docker volume for Jenkins data..."
docker volume create jenkins_home

# Launch Jenkins container
echo "🐳 Launching Jenkins container..."
docker run -d \
  --name jenkins-lotus \
  --restart unless-stopped \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --group-add $(getent group docker | cut -d: -f3) \
  jenkins/jenkins:lts-jdk11

# Wait for Jenkins to start
echo "⏳ Waiting for Jenkins to start (this may take a minute)..."
sleep 30

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^jenkins-lotus$"; then
    echo "✅ Jenkins container is running!"
else
    echo "❌ Error: Jenkins container failed to start"
    exit 1
fi

# Retrieve initial admin password
echo ""
echo "================================================"
echo "🔑 Jenkins Initial Administrator Password:"
echo "================================================"
docker exec jenkins-lotus cat /var/jenkins_home/secrets/initialAdminPassword
echo "================================================"
echo ""
echo "✅ Jenkins Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Open your browser and navigate to: http://localhost:8080"
echo "2. Use the password above to unlock Jenkins"
echo "3. Install suggested plugins"
echo "4. Create your admin user account"
echo ""
echo "📝 Save this password securely - you'll need it shortly!"
echo ""



