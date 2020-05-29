# Android Remote
Android APK &amp; NodeJS Rest API

## Requirements
* [Python 2.7](https://www.python.org/downloads/release/python-2717/)
* [NodeJS 12+](https://nodejs.org/en/) 

## Startup
* Install APK on phone
* Run "StartAPI.bat" to start (will install pm2 globally, if you don't want this please edit the bat file or just run de api with node from commandline)
* Run "StopAPI.bat" to stop

## Button Preset Syntax for Android App
* button [+ modifier]
    * Button: any button from [RobotJS](http://robotjs.io/docs/syntax#keys)
    * modifier: alt, command (win), control, and shift  
* click([button],[double]) [+ move(x, y)]
    * button: left, right, or middle
    * double: true for double click
    * x: int or "middle" (where middle = screenwidth/2)
    * y: int or "middle" (where middle = screenheight/2)  

example: f5 + control -> presses control and f5 at the same time  
example: click(right, true) + move(middle, 500) -> moves mouse to middle of width of screen and 500 pixels height, then double clicks  
example: click() -> clicks once at position of mouse  
example: click(middle) + move(middle, middle) -> moves mouse to center of the screen and middle clicks

## Last update
Added incognito default browser support (experimental: works for chrome, iexplore, microsoft edge, probably firefox & chromium, maybe opera, not safari.

## TODO
add support for multiple modifier keys