@echo off
title Deploy KITCHENcraft to Vercel
color 0F

echo =========================================================================
echo                    Deploy KITCHENcraft to Vercel
echo =========================================================================
echo.
set "PATH=C:\Users\Hp\.gemini\antigravity\scratch\tools\node-v20.18.0-win-x64;%PATH%"
cd /d "C:\Users\Hp\.gemini\antigravity\scratch\kitchencraft"

echo Deploying production build to Vercel...
npx vercel --prod

pause
