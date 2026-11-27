@echo off
rem Brand Intelligence Engine — start on this Windows computer for your team.
rem Double-click this file. Keep both windows open while people use the app.
rem Steps: back up the data, prepare the app, start it, then open a free Cloudflare link for the team.
cd /d "%~dp0"
title Brand Intelligence Engine

set BUILT_IN_SCHEDULER=true
set ALLOWED_ORIGINS=*.trycloudflare.com
set PORT=3000

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org, then double-click this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo First start: installing the app's components ^(a few minutes^)...
  call npm install
  if errorlevel 1 ( echo Installation failed - see the messages above. & pause & exit /b 1 )
)

echo Backing up your data...
call npm run --silent backup
if errorlevel 1 ( pause & exit /b 1 )

echo Preparing the app ^(1-2 minutes^)...
call npm run --silent build > .office-build.log 2>&1
if errorlevel 1 ( echo Preparing the app failed. Details are in .office-build.log & pause & exit /b 1 )

echo Starting the app in a second window - keep it open...
start "Brand Intelligence Engine - app (keep this window open)" cmd /k "npm start"

echo.
echo The app is starting on this computer: http://localhost:3000
echo.
where cloudflared >nul 2>nul
if errorlevel 1 (
  echo To share it with your team, install Cloudflare's free link program once. In this window type:
  echo     winget install --id Cloudflare.cloudflared
  echo then close both windows and double-click this file again.
  echo.
  echo Until then, only this computer can open the app.
  pause
  exit /b 0
)

echo Opening a free Cloudflare link for your team. Look below for an address ending in
echo .trycloudflare.com - send it to your team. It changes every time you start the app.
echo To stop: close both windows.
echo.
cloudflared tunnel --url http://localhost:3000
pause
