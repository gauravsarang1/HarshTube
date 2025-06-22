# Vercel Deployment Guide

## Prerequisites

1. Make sure your server is deployed and running (e.g., on Railway, Render, or any other platform)
2. Note down your server's public URL

## Vercel Deployment Steps

### 1. Environment Variables

In your Vercel project settings, add the following environment variable:

```
VITE_API_BASE_URL=https://your-server-domain.com
```

Replace `https://your-server-domain.com` with your actual server URL.

### 2. Build Settings

The project is configured to:
- Build from the root directory
- Install dependencies in the client directory
- Build the React app using Vite
- Output the build to `client/dist`

### 3. Deployment

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Deploy the project

### 4. Troubleshooting

If you encounter build errors:

1. Check that all environment variables are set correctly
2. Ensure your server is running and accessible
3. Check the build logs in Vercel dashboard

### 5. CORS Configuration

Make sure your server has CORS configured to allow requests from your Vercel domain:

```javascript
app.use(cors({
    origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:5173'],
    credentials: true
}));
```

## File Structure

```
/
├── client/          # React frontend
├── server/          # Node.js backend (not deployed to Vercel)
├── vercel.json      # Vercel configuration
├── package.json     # Root package.json for Vercel
└── .vercelignore    # Files to exclude from deployment
``` 