# Admitly - College Essay AI

An AI-powered college essay analysis tool that provides detailed feedback on essays using Groq's Llama 3 model.

## Features

- **Three Analysis Modes**: Standard, Competitive, and Elite with different difficulty levels
- **Essay Prompt Support**: Analyze how well essays address specific prompts
- **Detailed Feedback**: Scores and feedback for uniqueness, hook, voice, flow, authenticity, and conciseness
- **Word Count Tracking**: 650-word limit with real-time counting
- **Rate Limiting**: 1 analysis per minute for free users
- **Pro Features**: Enhanced AI analysis, unlimited analyses, priority support
- **Secure Payments**: Stripe integration for Pro upgrades
- **Responsive Design**: Works on desktop and mobile

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Google Analytics 4 Measurement ID
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Groq API Key
REACT_APP_GROQ_API_KEY=your_groq_api_key_here

# Stripe Configuration (for payments)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

### 3. Google Analytics Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (starts with "G-")
4. Add it to your `.env` file

### 4. Stripe Payment Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create a new account or sign in
3. Get your test API keys from the Developers section
4. Add them to your `.env` file

### 5. Install Server Dependencies
```bash
npm install express cors stripe concurrently
```

### 6. Run the App
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run server  # Backend on port 3001
npm start       # Frontend on port 3000
```

## Analytics Tracking

The app tracks the following events:

- **Essay Analysis**: When users analyze essays (tracks mode, word count, prompt usage)
- **Mode Selection**: When users change analysis modes
- **Feedback Expansion**: When users expand feedback sections
- **Errors**: API errors and parsing issues
- **Page Views**: Basic page view tracking

## Analysis Modes

### Standard Mode
- For schools with 50%+ acceptance rates
- Generous scoring (40-80 range)
- Encouraging feedback tone

### Competitive Mode  
- For schools with 15-50% acceptance rates
- Moderate scoring (30-90 range)
- Balanced feedback tone

### Elite Mode
- For top-tier schools with <15% acceptance rates
- Strict scoring (20-85 range)
- Critical feedback tone

## Deployment

The app is ready for deployment on platforms like:
- Netlify
- Vercel
- GitHub Pages

Make sure to set your environment variables in your deployment platform. 