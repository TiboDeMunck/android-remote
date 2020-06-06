# Android Remote
Android APK &amp; NodeJS Rest API

## Requirements
* [Python 2.7](https://www.python.org/downloads/release/python-2717/)
* [NodeJS 12+](https://nodejs.org/en/)  

## Startup
* Install APK on phone
* Run "StartAPI.bat" to start (will install pm2 globally, if you don't want this please edit the bat file or just run de api with node from commandline)
   * To view on which ip your pc is running the api, open file "ip.txt" after running StartAPI.bat.
* Run "StopAPI.bat" to stop  

## Button Preset Syntax for Android App
* button [+ modifiers]
    * Button: any button from [RobotJS](http://robotjs.io/docs/syntax#keys)
    * modifier: alt, command (win), control, and shift  
* click([button][, double]) [+ move(x[, y])]
    * button: left, right, or middle
    * double: true for double click
    * x: int or "middle" (where middle = screenwidth/2)
        * if only x has a value, it will automaticly take the middle of your screen for x and y
    * y: int or "middle" (where middle = screenheight/2)  

### examples: 
``` f5 + control ```  
-> presses control and f5 at the same time  
``` down + control + shift ```  
-> press control, shift and down at the same time  
``` click(right, true) + move(middle, 500) ```  
-> moves mouse to middle of width of screen and 500 pixels height, then double clicks  
``` click() ```  
-> clicks once at position of mouse  
``` click(middle) + move(middle, middle) ```  
-> moves mouse to center of the screen and middle clicks  
``` move(middle) ```  
-> moves to center of the screen  
  
Please note that the order of the inputs is not important!  

## Last update
Added incognito default browser support (experimental: works for chrome, iexplore, microsoft edge, probably firefox & chromium, maybe opera, not safari.  

## TODO
make change buttons more user friendly
