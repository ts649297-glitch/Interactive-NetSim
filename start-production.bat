@echo off
title Interactive NetSim Launcher (Production)
echo ========================================================
echo        INTERACTIVE NETSIM - PRODUCTION LAUNCHER          
echo ========================================================
echo.
echo Starting pre-built production server...
echo.

:: Open default browser after 2 seconds
start "" http://localhost:4000/

:: Start production Node server
node server/src/server.js

pause
