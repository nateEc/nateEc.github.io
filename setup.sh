#!/bin/bash

echo "🚀 Setting up Vue Portfolio..."

# Copy images folder
echo "📁 Copying images..."
cp -r ../images public/

# Copy Resume.pdf
echo "📄 Copying Resume.pdf..."
cp ../Resume.pdf public/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
