@echo off
title KITCHENcraft - Interactive Modular Kitchen Designer
color 0A

echo =========================================================================
echo               KITCHENcraft - 3D Modular Kitchen Designer
echo =========================================================================
echo.
echo  Starting Full-Stack Application...
echo.

set "PATH=C:\Users\Hp\.gemini\antigravity\scratch\tools\node-v20.18.0-win-x64;%PATH%"
cd /d "C:\Users\Hp\.gemini\antigravity\scratch\kitchencraft"

echo  Checking Node environment...
node -v
echo.
echo  Demo Credentials:
echo    - Admin Account:     admin@kitchencraft.com  /  admin123
echo    - Homeowner Account: sarah@example.com       /  user123
echo.
echo  Starting Unified Server on http://localhost:5000 ...
start "" http://localhost:5000
node server/src/server.js

pause
