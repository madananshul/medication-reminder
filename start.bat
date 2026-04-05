@echo off
title MedReminder
cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo   Node.js is not installed.
    echo   Please go to https://nodejs.org
    echo   and install the LTS version first.
    echo ============================================
    echo.
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo Setting up for first time... this may take a minute.
    call npm install
)

echo.
echo ============================================
echo   MedReminder is starting...
echo   Your browser will open in a few seconds.
echo.
echo   DO NOT CLOSE THIS WINDOW
echo   (the app stops if you close it)
echo ============================================
echo.

:: Open browser after delay
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

call npm run dev
