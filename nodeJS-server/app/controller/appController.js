const open = require('open');
const robot = require("robotjs");
const fs = require("fs")
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
    if (incognito === "true") open(playUrl, {
        app: ['chrome', '--incognito']
      })
      .then(() => res.send("success"))
      .catch((err) => res.send(err))
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

exports.next = function (req, res) {
  pressKey("next")
  res.send("success")
}

exports.previous = function (req, res) {
  pressKey("previous")
  res.send("success")
}

function pressKey(keyName){
  if (keys[keyName].length === 2) {
    if (keys[keyName][0][0] === "move") {
      robot.moveMouse(keys[keyName][0][1], keys[keyName][0][2])
      switch (keys[keyName][1].length) {
        case 2:
          robot.mouseClick(keys[keyName][1][1])
          break
        case 3:
          if (keys[keyName][1][2] === true){
            robot.mouseClick(keys[keyName][1][1])
            robot.mouseClick(keys[keyName][1][1])
          } else robot.mouseClick(keys[keyName][1][1])
          break
      }
    } else robot.keyTap(keys[keyName][0], keys[keyName][1])
  } else {
    if (keys[keyName][0][0] === "move") robot.moveMouse(keys[keyName][0][1], keys[keyName][0][2])
    else if (keys[keyName][0][0] === "click"){
      switch (keys[keyName][0].length) {
        case 2:
          robot.mouseClick(keys[keyName][0][1])
          break
        case 3:
          if (keys[keyName][0][2] === true){
            robot.mouseClick(keys[keyName][0][1])
            robot.mouseClick(keys[keyName][0][1])
          } else robot.mouseClick(keys[keyName][0][1])
          break
      }
    } else robot.keyTap(keys[keyName][0])
  }
}

exports.keys = function (req, res) {
  let data = req.body
  keyChecker(data, function (response, incChar, tooManyChar, nonModifier) {
    if (nonModifier.length !== 0) {
      let error = "When adding multiple keys, please use one modifier (control, shift, alt, command), don't use multiple click/move, click can only combine with move and vice versa for keys: "
      nonModifier.forEach(key => {
        error += `${key}, `
      })
      error = error.slice(0, -2)
      res.send(error)
    } else if (incChar.length !== 0) {
      let error = "These keys are not allowed: "
      incChar.forEach(key => {
        error += `${key}, `
      })
      error = error.slice(0, -2)
      res.send(error)
    } else if (tooManyChar.length !== 0) {
      let error = "Too many keys inputs for keys: "
      tooManyChar.forEach(key => {
        error += `${key}, `
      })
      error = error.slice(0, -2)
      res.send(error)
    } else {
      let keyNames = Object.keys(response)
      keyNames.forEach(name => {
        if (response[name].length === 2) {
          if (["alt", "command", "control", "shift"].includes(response[name][0])) keys[name] = [response[name][1], response[name][0]]
          else if (response[name][0][0] === "click") keys[name] = [response[name][1], response[name][0]]
          else keys[name] = [response[name][0], response[name][1]]
        } else keys[name] = [response[name][0]]
      });
      let file = JSON.stringify(keys)
      fs.writeFile('./app/keys/appKeys.json', file, (err) => {
        if (err) res.send(err);
        else res.send("success")
      });
    }
  })
}

function keyChecker(object, result) {
  let objectKeys = Object.keys(object)
  let nonAllowed = []
  let nonModifier = []
  let tooMayKeys = []
  objectKeys.forEach(key => { //loop over all keys
    object[key] = object[key].replace(/\s/g, "").toLowerCase().split("+") //remove whitespace, set all to lowercase and split on +
    if (object[key].length > 2) tooMayKeys.push(key) //if key has more then 2 inputs add to tooManyKeys
    if (object[key].length === 2) {
      if (!["alt", "command", "control", "shift"].includes(object[key][0]) && !["alt", "command", "control", "shift"].includes(object[key][1])) { // check if one of the two is a modifier
        if ((object[key][0].includes("click") && object[key][1].includes("click")) || (object[key][0].includes("move") && object[key][1].includes("move"))) nonModifier.push(key) //check if they are both click or move
        else if ((object[key][0].includes("click") && !object[key][1].includes("move")) || (object[key][0].includes("move") && !object[key][1].includes("click"))) nonModifier.push(key) // move and click can only combine with each other
      }
    }
    object[key].forEach((element, index) => { // loop over newley created array
      if (!allowKeys.includes(element) && !/^\w[a-z0-9]{0}$/g.test(element)) {
        checkMouseInput(element, function (check, command) {
          if (!check) nonAllowed.push(element) // if element is not in allowedKeys or isn't a-z, 0-9 then add it to nonAllowed
          else object[key][index] = command
        })
      }
    });
  });

  result(object, nonAllowed, tooMayKeys, nonModifier)
}

function checkMouseInput(command, result) {
  let check = false
  command = command.replace(/[)]/g, "").split(/[(]|,/g)
  if (command[0] === "click") {
    if (command.length === 2) {
      if (["left", "right", "middle", ""].includes(command[1])){
        if (command[1] === "") command[1] = "left"
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
  if (command[0] === "move" && command.length === 3) {
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
  result(check, command)
}