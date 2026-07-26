@echo off
title MediCare Reminder - Starting...

echo ============================================
echo   MediCare Reminder System - Launcher
echo ============================================
echo.
echo [1/2] Starting Backend Server (Port 5000)...
start "MediCare - Backend API" cmd /k "cd /d "%~dp0server" && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Client (Port 5173)...
start "MediCare - Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo ============================================
echo  App is running! Opening browser...
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo ============================================
echo.

start http://localhost:5173

exit
