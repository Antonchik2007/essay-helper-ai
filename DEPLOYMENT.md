# Admitly Deployment Guide - Netlify Functions

This guide will help you deploy Admitly to Netlify using serverless functions for the backend.

## Prerequisites

1. **Netlify Account** - for both frontend and backend deployment
2. **GitHub Account** - to host your code
3. **Stripe Account** - for payment processing

## Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 1.2 Install Netlify CLI (Optional)

```bash
npm install -g netlify-cli
```

## Step 2: Deploy to Netlify

### Option A: Deploy from GitHub (Recommended)

1. **Go to [Netlify](https://netlify.com)**
2. **Click "New site from Git"**
3. **Connect your GitHub account**
4. **Select your repository**
5. **Configure build settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. **Click "Deploy site"**

### Option B: Deploy from Local Build

1. **Build the project:**
   ```bash
   npm run build
   ```
2. **Drag the `build` folder** to Netlify's deploy area

## Step 3: Configure Environment Variables

In your Netlify dashboard, go to **Site Settings → Environment Variables** and add:

```
REACT_APP_GROQ_API_KEY=gsk_your_groq_key_here
REACT_APP_GA_MEASUREMENT_ID=G-your_ga_id_here
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

**Important Notes:**
- `STRIPE_SECRET_KEY` is used by the Netlify Function
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` is used by the frontend
- Never expose `STRIPE_SECRET_KEY` in the frontend

## Step 4: Test Your Deployment

1. **Test the frontend** at your Netlify URL
2. **Test the payment flow** with Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
3. **Check function logs** in Netlify dashboard

## Local Development

### Option A: Using Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Start local development:**
   ```bash
   netlify dev
   ```

3. **Set environment variables locally:**
   ```bash
   netlify env:set STRIPE_SECRET_KEY sk_test_your_key_here
   netlify env:set REACT_APP_GROQ_API_KEY gsk_your_key_here
   netlify env:set REACT_APP_GA_MEASUREMENT_ID G-your_ga_id_here
   netlify env:set REACT_APP_STRIPE_PUBLISHABLE_KEY pk_test_your_key_here
   ```

### Option B: Traditional Development

1. **Start the React app:**
   ```bash
   npm start
   ```

2. **For payment testing**, you'll need to deploy the functions or use a separate backend

## Troubleshooting

### Common Issues

1. **Function Not Found (404)**
   - Check that `netlify/functions/create-payment-intent.js` exists
   - Verify the function is properly exported
   - Check Netlify build logs

2. **CORS Errors**
   - The function includes CORS headers automatically
   - Check that the function URL is correct

3. **Environment Variables**
   - Ensure all variables are set in Netlify dashboard
   - Check that variable names match exactly

4. **Build Failures**
   - Check build logs in Netlify dashboard
   - Ensure all dependencies are in `package.json`

### Stripe Test Cards

Use these test cards for testing:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## Security Notes

1. **Never commit** `.env` files to Git
2. **Use environment variables** for all sensitive data
3. **Test thoroughly** before going live
4. **Monitor function logs** for any issues

## Custom Domain (Optional)

1. **Add custom domain** in Netlify dashboard
2. **Update DNS** records as instructed
3. **Update Stripe webhook URLs** if needed

## Monitoring

1. **Check function logs** in Netlify dashboard
2. **Monitor Stripe dashboard** for payment activity
3. **Set up alerts** for any failures

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Payment flow works with test cards
- [ ] Environment variables are set correctly
- [ ] Function logs show no errors
- [ ] Mobile responsiveness works
- [ ] Analytics tracking works
- [ ] Custom domain (if applicable) works

## Benefits of This Approach

✅ **Single Platform**: Everything on Netlify
✅ **No Separate Backend**: Serverless functions handle payments
✅ **Easy Deployment**: One-click deployment from GitHub
✅ **Automatic Scaling**: Functions scale automatically
✅ **Free Tier**: Generous free tier for functions
✅ **Integrated Logs**: All logs in one place 