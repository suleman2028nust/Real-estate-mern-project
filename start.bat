@echo off
title MERN Estate

echo Starting MERN Estate...
echo.

start "Backend (port 3000)" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 2 /nobreak >nul

start "Frontend (port 5173)" cmd /k "cd /d %~dp0client && npm run dev"

echo Servers started!
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:5173
echo.
timeout /t 3 /nobreak >nul
exit
