@echo off
cd /d "%~dp0/nodeJS-server"
WHERE pm2
IF %ERRORLEVEL% NEQ 0 (npm install pm2 -g && IF exist node_modules ( pm2 start android_remote_api.js ) ELSE ( npm install && pm2 start android_remote_api.js )) ELSE (IF exist node_modules ( pm2 start android_remote_api.js ) ELSE ( npm install && pm2 start android_remote_api.js ))