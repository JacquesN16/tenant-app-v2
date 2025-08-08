#!/bin/bash

echo "🧹 Cleaning database..."
cd backend && npm run db:clean
echo "✅ Database cleaned successfully!"