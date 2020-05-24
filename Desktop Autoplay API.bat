@echo off
cd "C:\Users\tibod\Documents\Visual Code\youtubeFetchApi"

IF exist node_modules ( forever server.js ) ELSE ( npm install && forever server.js )
