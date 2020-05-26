const open = require('open');
const robot = require("robotjs");

let screenSize = robot.getScreenSize();
let x = screenSize.width / 2;
let y = screenSize.height / 2;

//controller for incoming data
exports.play_video = function (req, res) {
  let data = req.body.url
  let playUrl = ""

  if (data !== "") {
    playUrl = getUrl(data)
    if (!checkUrl(playUrl, ["youtu", "netflix", "spotify", "twitch"])) res.send("Didn't receive a correct link")
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
  robot.moveMouse(x, y);
  robot.mouseClick();
  robot.mouseClick();
  res.send("success")
}

exports.forward = function (req, res) {
  robot.keyTap("right")
  res.send("success")
}

exports.backward = function (req, res) {
  robot.keyTap("left")
  res.send("success")
}

exports.close = function (req, res) {
  robot.keyTap("w", "control")
  res.send("success")
}

exports.play = function (req, res) {
  robot.moveMouse(x, y);
  robot.mouseClick();
  res.send("success")
}

exports.louder = function (req, res) {
  robot.keyTap("up")
  res.send("success")
}

exports.quieter = function (req, res) {
  robot.keyTap("down")
  res.send("success")
}