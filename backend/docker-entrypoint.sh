#!/bin/sh
set -e

echo "🪷 Lotus Backend - Starting initialization..."

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
until nc -z mongodb 27017; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done

echo "✅ MongoDB is ready!"

# Create upload directories if they don't exist
echo "📁 Creating upload directories..."
mkdir -p /app/uploads/videos
mkdir -p /app/uploads/thumbnails
mkdir -p /app/uploads/avatars

# Create logs directory
mkdir -p /app/logs

echo "🚀 Starting Lotus Backend API..."

# Execute the main command
exec "$@"
