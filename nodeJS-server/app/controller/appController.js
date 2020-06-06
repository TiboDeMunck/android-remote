const open = require('open');
const robot = require("robotjs");
const fs = require("fs")
const defaultBrowser = require('x-default-browser');
let keys;
try {
  keys = require("../keys/appKeys.json")
} catch {
  keys = {
    "fullscreen": ["f"],
    "play": ["space"],
    "plus": ["right"],
    "minus": ["left"],
    "louder": ["audio_vol_up"],
    "quieter": ["audio_vol_down"],
    "mute": ["m"],
    "next": ["n", "shift"],
    "previous": ["p", "shift"]
  }
}
let allowKeys = require("../keys/allowedKeys.js").allowedKeys

let x_middle = robot.getScreenSize().width / 2
let y_middle = robot.getScreenSize().height / 2

//controller for incoming data
exports.play_video = function (req, res) {
  let data = req.body.url
  let incognito = req.body.incognito
  let playUrl = ""

  if (data !== "") {
    playUrl = getUrl(data)
    if (incognito === "true") defaultBrowser(function (err, response) { //check default browser
      let privacy = ""
      let browser = ""
      if (response.identity == "msedgehtm") {
        privacy = "--private"
        browser = "MicrosoftEdge"
      } else if (response.isIE) {
        privacy = "-private"
        browser = "iexplore"
      } else if (response.isSafari) {
        privacy = ""
        browser = "safari"
      } else if (response.isFirefox) {
        privacy = "-private"
        browser = "firefox"
      } else if (response.isChrome) {
        privacy = "--incognito"
        browser = "chrome"
      } else if (response.isChromium) {
        privacy = "--incognito"
        browser = "chromium"
      } else if (response.isOpera) {
        privacy = "--private"
        browser = "opera"
      }
      open(playUrl, {
          app: [browser, privacy]
        })
        .then(() => res.send("success"))
        .catch((err) => res.send(err))
    })
    else open(playUrl)
      .then(() => res.send("success"))
      .catch((err) => res.send(err))
  } else res.send("Didn't receive a link")
}

//get url from incoming data
let getUrl = function (data) {
  let array = data.split(/[\s\n]+/)
  let url = ""
  array.forEach(element => {
    if (element.includes("http")) url = element
  });
  return url
};

//check if url contains string from checkList
let checkUrl = function (url, checkList) {
  let foundUrl = false;
  checkList.forEach(element => {
    if (url.includes(element)) foundUrl = true
  });
  return foundUrl
}

//controls
exports.fullscreen = function (req, res) {
  pressKey("fullscreen")
  res.send("success")
}

exports.forward = function (req, res) {
  pressKey("plus")
  res.send("success")
}

exports.backward = function (req, res) {
  pressKey("minus")
  res.send("success")
}

exports.close = function (req, res) {
  robot.keyTap("w", "control")
  res.send("success")
}

exports.play = function (req, res) {
  pressKey("play")
  res.send("success")
}

exports.louder = function (req, res) {
  pressKey("louder")
  res.send("success")
}

exports.quieter = function (req, res) {
  pressKey("quieter")
  res.send("success")
}

exports.mute = function (req, res) {
  pressKey("mute")
  res.send("success")
}

exports.next = function (req, res) {
  pressKey("next")
  res.send("success")
}

exports.previous = function (req, res) {
  pressKey("previous")
  res.send("success")
}

function pressKey(keyName) {
  let command = keys[keyName]
  if (command[0][0] === "click" || command[0][0] === "move") { // if its a click/move statement
    if (command.length === 1) {
      if (command[0][0] === "move") move(command[0])
      else click(command[0])
    } else {
      if (command[0][0] === "move") {
        move(command[0])
        click(command[1])
      } else {
        move(command[1])
        click(command[0])
      }
    }
  } else { // if not a move/click statement
    if (command.length === 1) robot.keyTap(command[0])
    else robot.keyTap(command[0], command[1])
  }
}

function click(command){
  robot.mouseClick(command[1])
  if (command[2] === true) robot.mouseClick(command[1]) // extra click on double click
}

function move(command){
  robot.moveMouse(command[1], command[2])
}

exports.keys = function (req, res) {
  let data = req.body
  keyChecker(data, function (response, errorMessage, errorKey) {
    if (errorMessage) { // checks all error messages
      let error = ""
      switch (errorMessage) {
        case "nonModifier":
          error = `When adding multiple keys, please use at least one modifier (control, shift, alt, command) and don't use more then one primary key. Problem in key: ${errorKey}`
          break
        case "clickMove":
          error = `Please refrain from using move or click with other keys, also no more then one move and click is allowed. Problem in key: ${errorKey}`
          break
        case "incChar":
          error = `Please use correct syntax when altering preset for keys. Problem in key: ${errorKey}`
          break
        case "allModifier":
          error = `When using modifier keys (control, shift, alt, command), please use at least one non modifier key. Problem in key: ${errorKey}`
          break
      }
      res.send(error)
    } else {
      let keyNames = Object.keys(response)
      keyNames.forEach(name => { // overwrites previous preset
        keys[name] = response[name]
      });
      let file = JSON.stringify(keys)
      fs.writeFile('./app/keys/appKeys.json', file, (err) => {
        if (err) res.send(err);
        else res.send("Successfully saved new button preset!")
      });
    }
  })
}

function keyChecker(object, result) {
  let objectKeys = Object.keys(object)

  objectKeys.forEach(key => { //loop over all keys
    object[key] = object[key].replace(/\s/g, "").toLowerCase().split("+") //remove whitespace, set all to lowercase and split on +
    object[key] = modifierSort(object[key]) // sorts primary keys from modifer keys
    if (typeof (object[key][0]) !== typeof ("")) { // check if all keys are modifer keys, if so return error
      result(null, "allModifier", key)
    }

    object[key].forEach((element, index) => {
      if (typeof (element) === typeof ("")) { // check if it isn't a modifier
        if (!allowKeys.includes(element) && !/^\w[a-z0-9]{0}$/g.test(element)) { // check if the primary key is a click or move
          checkMouseInput(element, function (command, check) {
            if (check) object[key][index] = command //if it isn't a click or a move then send error
            else result(null, "incChar", key)
          })
        }
      }
    })

    if (clickMoveCounter(object[key])) result(null, "clickMove", key) //check if click and move is combined with each other and nothing else (also counts move and click)

    if (primaryCounter(object[key]) > 1) result(null, "nonModifier", key) //check if there are too many primaries (will return 1 when click and move are there togheter but more when there are too many click and moves)
  });

  result(object, null, null)
}

function clickMoveCounter(commands) {
  let moveCounter = 0
  let clickCounter = 0
  let incorrect = false

  if (commands.length > 1) {
    commands.forEach(element => {
      if (element[0] === "click") clickCounter += 1 //counts times it has a click
      if (element[0] === "move") moveCounter += 1 //counts times it has a move
    });
    if (moveCounter >= 1 || clickCounter >= 1) { // if click or moves happens once
      commands.forEach(element => {
        if (typeof (element) === typeof ([])) { //check if it is combined with another primary than click or move
          if (element[0] !== "click" && element[0] !== "move") incorrect = true
        } else incorrect = true
      });
    }
  }

  if (clickCounter > 1 || moveCounter > 1 || incorrect) return true
  return false
}

function primaryCounter(commands) {
  let counter = 0
  commands.forEach(element => {
    if (typeof (element) === typeof ("")) counter += 1 //checks if there are more then one primary keys
  });
  return counter
}

function modifierSort(arrayKeys) { // sorts modifier keys to the back of the array into a different array
  let modifierKeys = [];
  let primaryKeys = []
  arrayKeys.forEach(element => {
    if (["alt", "command", "control", "shift"].includes(element)) modifierKeys.push(element)
    else primaryKeys.push(element)
  })
  if (modifierKeys.length > 0) primaryKeys.push(modifierKeys)
  return primaryKeys
}

function checkMouseInput(command, result) { //makes the input for click and move readable for robotjs
  let check = false
  command = command.replace(/[)]/g, "").split(/[(]|,/g)
  if (command[0] === "click") { // checks all different click inputs and rewrites to readable data
    if (command.length === 2) {
      if (["left", "right", "middle", ""].includes(command[1])) {
        if (command[1] === "") command[1] = "left"
        command.push(false)
        check = true //returns true on mouse functions
      }
    } else if (command.length === 3) {
      if (["left", "right", "middle", ""].includes(command[1]) && ["true", "false", ""].includes(command[2])) {
        if (command[1] === "") command[1] = "left"
        if (command[2] === "true") command[2] = true
        else command[2] = false
        check = true //returns true on mouse functions
      }
    }
  }

  if (command[0] === "move") { // checks all different move inputs and rewrites to readable data
    if (command.length === 2) {
      if (["middle", ""].includes(command[1])) {
        command[1] = x_middle
        command.push(y_middle)
        check = true
      }
    } else if (command.length === 3) {
      if (command[1] === "middle" && command[2] === "middle") {
        command[1] = x_middle
        command[2] = y_middle
        check = true
      } else if (command[1] === "middle") {
        command[1] = x_middle
        command[2] = parseInt(command[2])
        if (command[2] != NaN) check = true
      } else if (command[2] === "middle") {
        command[1] = parseInt(command[1])
        command[2] = y_middle
        if (command[1] != NaN) check = true
      } else {
        command[1] = parseInt(command[1])
        command[2] = parseInt(command[2])
        if (command[1] != NaN && command[2] != NaN) check = true
      }
    }
  }
  result(command, check)
}