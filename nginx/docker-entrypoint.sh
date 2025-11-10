#!/bin/sh
set -e

echo "🌐 Lotus Nginx - Starting initialization..."

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
max_attempts=30
attempt=0

until wget --quiet --tries=1 --spider http://backend:5000/api/health || [ $attempt -eq $max_attempts ]; do
  attempt=$((attempt + 1))
  echo "Backend is unavailable - attempt $attempt/$max_attempts"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "⚠️  Backend failed to start within expected time, but continuing..."
else
  echo "✅ Backend is ready!"
fi

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
max_attempts=30
attempt=0

until wget --quiet --tries=1 --spider http://frontend:80 || [ $attempt -eq $max_attempts ]; do
  attempt=$((attempt + 1))
  echo "Frontend is unavailable - attempt $attempt/$max_attempts"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "⚠️  Frontend failed to start within expected time, but continuing..."
else
  echo "✅ Frontend is ready!"
fi

echo "🚀 Starting Nginx..."

# Start nginx in foreground
exec nginx -g 'daemon off;'
