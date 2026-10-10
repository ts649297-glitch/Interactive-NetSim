@echo off
title Interactive NetSim Launcher
echo ========================================================
echo        INTERACTIVE NETSIM - ONE-CLICK LAUNCHER          
echo ========================================================
echo.
echo Starting Node.js backend server and Vite frontend...
echo.

:: Open default browser after 3 seconds
start "" http://localhost:3000/

:: Start dual server launcher
node start-dev.js

pause
