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

//controller for incoming data
exports.play_video = function (req, res) {
  let data = req.body.url
  let incognito = req.body.incognito
  let playUrl = ""

  if (data !== "") {
    playUrl = getUrl(data)
    if (incognito === "true") open(playUrl, {app: ['chrome', '--incognito']})
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
  if (keys.fullscreen.length === 2) robot.keyTap(keys.fullscreen[0], keys.fullscreen[1])
  else robot.keyTap(keys.fullscreen[0])
  res.send("success")
}

exports.forward = function (req, res) {
  if (keys.plus.length === 2) robot.keyTap(keys.plus[0], keys.plus[1])
  else robot.keyTap(keys.plus[0])
  res.send("success")
}

exports.backward = function (req, res) {
  if (keys.minus.length === 2) robot.keyTap(keys.minus[0], keys.minus[1])
  else robot.keyTap(keys.minus[0])
  res.send("success")
}

exports.close = function (req, res) {
  robot.keyTap("w", "control")
  res.send("success")
}

exports.play = function (req, res) {
  if (keys.play.length === 2) robot.keyTap(keys.play[0], keys.play[1])
  else robot.keyTap(keys.play[0])
  res.send("success")
}

exports.louder = function (req, res) {
  if (keys.louder.length === 2) robot.keyTap(keys.louder[0], keys.louder[1])
  else robot.keyTap(keys.louder[0])
  res.send("success")
}

exports.quieter = function (req, res) {
  if (keys.quieter.length === 2) robot.keyTap(keys.quieter[0], keys.quieter[1])
  else robot.keyTap(keys.quieter[0])
  res.send("success")
}

exports.next = function (req, res) {
  if (keys.next.length === 2) robot.keyTap(keys.next[0], keys.next[1])
  else robot.keyTap(keys.next[0])
  res.send("success")
}

exports.previous = function (req, res) {
  if (keys.previous.length === 2) robot.keyTap(keys.previous[0], keys.previous[1])
  else robot.keyTap(keys.previous[0])
  res.send("success")
}

exports.keys = function (req, res) {
  let data = req.body
  keyChecker(data, function (response, incChar, tooManyChar, nonModifier) {
    if (nonModifier.length !== 0) {
      let error = "When adding multiple keys, please use one modifier (control, shift, alt, command) for keys: "
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
      if (!["alt", "command", "control", "shift"].includes(object[key][0]) && !["alt", "command", "control", "shift"].includes(object[key][1])) nonModifier.push(key) // check if one of the two is a modifier
    }
    object[key].forEach(element => { // loop over newley created array
      if (!allowKeys.includes(element) && !/^\w[a-z0-9]{0}$/g.test(element)) nonAllowed.push(element) // if element is not in allowedKeys or isn't a-z, 0-9 then add it to nonAllowed
    });
  });

  result(object, nonAllowed, tooMayKeys, nonModifier)
}