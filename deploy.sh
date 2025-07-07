#!/bin/bash

echo "🚀 Admitly Deployment Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the essay-helper-ai directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push"
echo ""
echo "2. Deploy backend to Render/Railway:"
echo "   - Go to render.com or railway.app"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'backend'"
echo "   - Add STRIPE_SECRET_KEY environment variable"
echo ""
echo "3. Deploy frontend to Netlify:"
echo "   - Go to netlify.com"
echo "   - Connect your GitHub repo"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: build"
echo "   - Add environment variables in Netlify dashboard"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 