@echo off
echo Starting StockBot Pro...
echo.
echo [1/2] Starting backend API (port 3001)...
start "StockBot Backend" cmd /k "cd /d %~dp0backend && node src/index.js"
timeout /t 2 /nobreak >nul
echo [2/2] Starting frontend (port 5173)...
start "StockBot Frontend" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Both servers starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
pause
