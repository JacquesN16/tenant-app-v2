#!/bin/bash

echo "🌱 Populating database with mock data..."
cd backend && npm run db:populate
echo "✅ Database populated successfully!"