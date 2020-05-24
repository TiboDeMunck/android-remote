@echo off
cd /d "%~dp0/nodeJS-server"
IF exist node_modules ( forever server.js ) ELSE ( npm install && forever server.js )
