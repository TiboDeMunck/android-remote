@echo off
cd /d "%~dp0/nodeJS-server"
IF exist node_modules ( pm2 start android_remote_api.js ) ELSE ( npm install && pm2 start android_remote_api.js )