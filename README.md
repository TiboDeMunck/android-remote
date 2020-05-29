# Android Remote
Android APK &amp; NodeJS Rest API

## Requirements
* [Python 2.7](https://www.python.org/downloads/release/python-2717/)
* [NodeJS 12+](https://nodejs.org/en/) 

## Startup
* Install APK on phone
* Run "Desktop Autoplay API.bat"

## Button Preset Syntax
* button [+ modifier]
    * Button: any button from [RobotJS](http://robotjs.io/docs/syntax#keys)
    * modifier: alt, command (win), control, and shift  
or  
*click([button],[double]) [+ move(x, y)]
    * button: left, right, or middle
    * x: int or "middle" (where middle = screenwidth/2)
    * y: int or "middle" (where middle = screenheight/2)

## TODO
add support for multiple modifier keys