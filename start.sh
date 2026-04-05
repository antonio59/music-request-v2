#!/bin/bash
set -e

cd /home/openclaw/.openclaw/workspace/music-request-v2

echo "🎵 Music Request v2 - Starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Default accounts:"
echo "  Parent: username=parent, password=parent123"
echo "  Yoto Kid: username=yoto-kid, password=yoto123"
echo "  iPod Kid: username=ipod-kid, password=ipod123"
echo ""

# Seed database if it doesn't exist
if [ ! -f data/music-request.db ]; then
  echo "📦 Seeding database..."
  node seed.js
  echo ""
fi

# Start both servers
npm run dev
