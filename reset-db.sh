#!/bin/bash

echo "🔄 Resetting database (clean + populate)..."
cd backend && npm run db:reset
echo "✅ Database reset completed successfully!"