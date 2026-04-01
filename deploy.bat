@echo off
echo ========================================
echo NYC Transit Chatbot - Vercel Deploy Script
echo ========================================
echo.

echo This script will help you deploy to Vercel
echo Make sure you have:
echo - GitHub account
echo - Vercel account (vercel.com)
echo - MTA API key (optional)
echo.

set /p GITHUB_REPO="Enter your GitHub repository URL (e.g., https://github.com/username/repo-name): "
set /p MTA_KEY="Enter your MTA API key (or press Enter to skip): "

echo.
echo Step 1: Pushing to GitHub...
git remote add origin %GITHUB_REPO%
git push -u origin master

if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub!
    echo Make sure the repository exists and you have access.
    pause
    exit /b 1
)

echo.
echo Step 2: Opening Vercel for deployment...
start https://vercel.com/new

echo.
echo Step 3: Instructions for Vercel:
echo 1. Click "Import Project"
echo 2. Connect your GitHub account
echo 3. Select the repository: %GITHUB_REPO%
echo 4. Vercel will auto-detect the settings
echo 5. Add environment variables:
if defined MTA_KEY (
    echo    MTA_API_KEY = %MTA_KEY%
) else (
    echo    (No MTA key provided - demo will use mock data)
)
echo 6. Click "Deploy"
echo.

echo ========================================
echo Deployment Instructions Complete!
echo ========================================
echo.
echo After deployment, you'll get a URL like:
echo https://nyc-transit-chatbot.vercel.app
echo.
echo Share this URL with your business partner!
echo.
pause