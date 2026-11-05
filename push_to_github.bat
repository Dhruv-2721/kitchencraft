@echo off
title Push KITCHENcraft to GitHub
color 0B

echo =========================================================================
echo               Push KITCHENcraft to GitHub
echo =========================================================================
echo.
set "PATH=C:\Users\Hp\.gemini\antigravity\scratch\tools\git\cmd;%PATH%"
cd /d "C:\Users\Hp\.gemini\antigravity\scratch\kitchencraft"

echo Current remote URL:
git remote -v
echo.
echo Pushing branch 'main' to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. 
    echo Please make sure you have created the repository 'kitchencraft' on GitHub:
    echo https://github.com/new
) else (
    echo.
    echo [SUCCESS] Code successfully pushed to GitHub!
)

pause
