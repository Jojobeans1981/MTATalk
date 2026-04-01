@echo off
echo ========================================
echo NYC Transit Voice Chatbot Setup Script
echo ========================================
echo.

echo Step 1: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully.
echo.

echo Step 2: Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully.
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To run the demo:
echo 1. Open two command prompts
echo 2. In first: cd backend && npm run dev
echo 3. In second: cd frontend && npm run dev
echo 4. Open browser to http://localhost:5173
echo.
echo Note: Add MTA_API_KEY to backend/.env for live data
echo (demo works without it using mock data)
echo.
pause