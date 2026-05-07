@echo off
echo ========================================
echo   KH Arena - Starting Servers...
echo ========================================

echo.
echo [1/2] Starting Backend (Express API)...
start cmd /k "cd /d %~dp0api && echo --- Backend running on port 3001 --- && node server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend (Vite + React)...
start cmd /k "cd /d %~dp0 && echo --- Frontend running on http://localhost:5173 --- && npm run dev"

echo.
echo ========================================
echo   Both servers are starting...
echo   Backend : http://localhost:3001
echo   Frontend: http://localhost:5173
echo ========================================
echo.
