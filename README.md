# NYC Transit Voice Chatbot + GTABUS Promo Demo

A full-stack voice-powered chatbot app for NYC riders to get real-time bus/train arrivals, local place suggestions, and GTABUS game recommendations.

## 🎯 Demo Overview

This demo showcases:
- **Voice Assistant**: Speak naturally to ask about transit arrivals
- **Real-time MTA Data**: Live bus/subway arrival times using GTFS-RT feeds
- **Location-based Queries**: Nearest stops based on your latitude/longitude
- **Place Recommendations**: Tourist spots, restaurants, and attractions
- **GTABUS Integration**: Built-in game promotion in every response

## 📋 Prerequisites

Before running, ensure you have:
- **Node.js 18+** installed ([download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Modern web browser** (Chrome/Edge recommended for voice features)
- **MTA API Key** (optional for live data, demo works without it)

## 🚀 Quick Start Setup (5 minutes)

### Option 1: Automated Vercel Deploy (Easiest!)
**Windows**: Double-click `deploy.bat`
**Mac/Linux**: Run `chmod +x deploy.sh && ./deploy.sh`

This interactive script will:
- Guide you through GitHub repository creation
- Push your code to GitHub
- Open Vercel in your browser
- Provide step-by-step deployment instructions

### Option 2: One-Click Deploy
**Deploy instantly**: Click the button below!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nyc-transit-chatbot)

### Option 3: Manual GitHub + Vercel

### Option 2: Automated Setup (Local Development)
**Windows**: Double-click `setup.bat`
**Mac/Linux**: Run `chmod +x setup.sh && ./setup.sh`

This will install all dependencies automatically.

### Option 3: Manual Setup

### Step 1: Extract the folder
- Unzip/extract the `MTATalk` folder to your desktop or preferred location
- Open a terminal/command prompt in the extracted folder

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment (Optional)
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file to add your MTA API key (optional)
# MTA_API_KEY=your_mta_api_key_here
# OPENAI_API_KEY=your_openai_key_here
```

**Note**: The demo works without API keys using mock data. Real MTA data requires an API key from [datamine.mta.info](https://datamine.mta.info).

### Step 4: Start Backend Server
```bash
# Still in backend/ folder
npm run dev
```
You should see: `NYC Transit Chatbot backend running on http://localhost:4000`

### Step 5: Install Frontend Dependencies (New Terminal)
```bash
# Open a new terminal/command prompt
cd frontend
npm install
```

### Step 6: Start Frontend App
```bash
# Still in frontend/ folder
npm run dev
```
You should see: `Local: http://localhost:5173` (or similar port)

### Step 7: Open in Browser
- Open your browser to `http://localhost:5173`
- Allow microphone permissions when prompted
- Start chatting!

## 🎙️ How to Use the Demo

### Voice Mode (Recommended)
1. Click the `Speak 🎙️` button
2. Say something like:
   - "When is the next bus near me?"
   - "Where should I visit in NYC?"
   - "What's the next subway at Times Square?"
3. The bot will respond both in text and voice

### Text Mode
1. Type your question in the text box
2. Click `Send`
3. Bot responds in chat

### Location Settings
- Update latitude/longitude in the input fields for location-specific results
- Default: Times Square area (40.7128, -74.0060)

## 📁 Project Structure

```
MTATalk/
├── README.md              # This file with setup instructions
├── VERCEL_DEPLOY.md       # Detailed Vercel deployment guide
├── package.json           # Root package.json for Vercel
├── vercel.json            # Vercel deployment configuration
├── deploy.bat             # Windows automated deploy script
├── deploy.sh              # Mac/Linux automated deploy script
├── setup.bat              # Windows automated setup script
├── setup.sh               # Mac/Linux automated setup script
├── api/                   # Vercel serverless API routes
│   ├── next-ride.js       # Real-time transit arrivals endpoint
│   ├── place-suggestions.js # Location recommendations endpoint
│   └── chat.js            # Natural language chat processing
├── frontend/              # React voice app
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── index.html         # HTML entry point
│   └── src/               # React source code
│       ├── App.jsx        # Main React component
│       ├── main.jsx       # React entry point
│       └── style.css      # CSS styles
├── backend/               # Original Express server (for local dev)
│   ├── package.json       # Backend dependencies
│   ├── server.js          # Main server file
│   └── .env.example       # Environment variables template
└── .gitignore             # Git ignore rules
```

## 🔧 API Endpoints

The backend provides these endpoints:

- `GET /api/next-ride?lat=40.7128&lon=-74.0060` - Get next arrivals
- `GET /api/place-suggestions?q=park` - Get place recommendations
- `POST /api/chat` - Natural language chat interface

## 🛠️ Troubleshooting

### Port Already in Use
If you see "EADDRINUSE" error:
```bash
# Find process using port 4000
netstat -ano | findstr :4000

# Kill the process (replace XXXX with actual PID)
taskkill /PID XXXX /F
```

### Voice Not Working
- Ensure you're using Chrome or Edge browser
- Allow microphone permissions when prompted
- Check browser console for errors

### API Key Issues
- Without MTA_API_KEY: App uses mock data (still works!)
- With MTA_API_KEY: Gets real live transit data
- Get key at: https://datamine.mta.info

### Installation Issues
- Ensure Node.js 18+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## ☁️ Vercel Deployment

This app is optimized for Vercel deployment with serverless functions:

### Deploy Steps:
1. **Push to GitHub**: Upload this entire folder to a GitHub repository
2. **Connect to Vercel**: Go to [vercel.com](https://vercel.com) and import your repo
3. **Add Environment Variables**:
   - `MTA_API_KEY`: Your MTA API key (optional - works with mock data)
   - `OPENAI_API_KEY`: OpenAI key for enhanced NLP (optional)
4. **Deploy**: Vercel will automatically build and deploy
5. **Share URL**: Get a live URL like `https://nyc-transit-chatbot.vercel.app`

### Vercel Features Used:
- **Serverless Functions**: API routes in `/api` directory
- **Static Site**: React frontend with Vite
- **Automatic HTTPS**: SSL certificate included
- **Global CDN**: Fast loading worldwide
- **Environment Variables**: Secure API key storage

### Testing Deployed App:
- Voice recognition works in all modern browsers
- Real MTA data if API key is configured
- GTABUS promotion included in all responses
- Responsive design for mobile/desktop

---

## 🎯 Demo URLs (After Deployment)

Once deployed to Vercel, share these URLs with your business partner:
- **Live Demo**: `https://your-app-name.vercel.app`
- **API Docs**: `https://your-app-name.vercel.app/api/chat` (POST endpoint)

The demo will work immediately with mock data, or with real MTA data if you add the API key!
