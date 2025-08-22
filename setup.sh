#!/bin/bash

echo "🚀 Setting up NDA Redline Project..."

# Create environment files
echo "📝 Creating environment files..."
cp api/env.sample api/.env
cp web/env.local.example web/.env.local

echo "✅ Environment files created!"
echo ""
echo "📋 Next steps:"
echo "1. Edit api/.env with your configuration values"
echo "2. Edit web/.env.local with your API base URL"
echo "3. Run 'make up' to start all services"
echo "4. Run 'make logs' to monitor service health"
echo ""
echo "🔍 Verify setup with:"
echo "curl http://localhost:5001/healthz"
echo ""
echo "🌐 Access the app at: http://localhost:3000"
