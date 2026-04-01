# NYC Transit Chatbot - Vercel Deployment Guide

## Quick Deploy Steps

### 1. Prepare Your Code
- This folder contains everything needed
- No changes required for Vercel deployment

### 2. Push to GitHub
```bash
# Create a new GitHub repository
# Push this entire folder to GitHub
git init
git add .
git commit -m "Initial commit - NYC Transit Voice Chatbot"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Add environment variables (optional):
   - `MTA_API_KEY`: Your MTA API key for real data
   - `OPENAI_API_KEY`: For enhanced chat features
6. Click "Deploy"

### 4. Get Your Live URL
- Vercel will provide a URL like: `https://nyc-transit-chatbot.vercel.app`
- Share this URL with your business partner!

## What Works on Vercel

✅ Voice recognition and speech synthesis
✅ Real-time MTA GTFS-RT data (with API key)
✅ Location-based transit queries
✅ Place recommendations
✅ GTABUS game promotion
✅ Responsive mobile/desktop design
✅ HTTPS security
✅ Global CDN performance

## Testing the Deployed App

1. Open the Vercel URL in Chrome/Edge
2. Allow microphone permissions
3. Try voice commands:
   - "When is the next bus near me?"
   - "Where should I visit in NYC?"
4. Or use text input
5. Bot responds with voice + text

## Environment Variables (Optional)

Add these in Vercel dashboard under Project Settings > Environment Variables:

```
MTA_API_KEY=your_mta_api_key_here
OPENAI_API_KEY=your_openai_key_here
```

Without API keys, the app uses realistic mock data and still demonstrates all features!

---

**Ready to deploy! 🚀**