#!/bin/bash

echo "🚀 Admitly Netlify Deployment Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the essay-helper-ai directory"
    exit 1
fi

# Check if netlify/functions exists
if [ ! -d "netlify/functions" ]; then
    echo "❌ Error: netlify/functions directory not found"
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
echo "📋 Next steps for Netlify deployment:"
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for Netlify deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Netlify:"
echo "   - Go to netlify.com"
echo "   - Click 'New site from Git'"
echo "   - Connect your GitHub repository"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: build"
echo ""
echo "3. Set Environment Variables in Netlify:"
echo "   - REACT_APP_GROQ_API_KEY"
echo "   - REACT_APP_GA_MEASUREMENT_ID"
echo "   - REACT_APP_STRIPE_PUBLISHABLE_KEY"
echo "   - STRIPE_SECRET_KEY"
echo ""
echo "4. Test your deployment:"
echo "   - Visit your Netlify URL"
echo "   - Test the payment flow"
echo "   - Check function logs"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎉 Your app will be deployed with both frontend and backend on Netlify!" 