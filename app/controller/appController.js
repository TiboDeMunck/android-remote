const open = require('open');
const robot = require("robotjs");

let screenSize = robot.getScreenSize();
let x = screenSize.width / 2;
let y = screenSize.height / 2;

exports.play_video = function (req, res) {
  let data = req.body.url
  let playUrl = ""

  if (data !== "") {
    if (data.includes("youtu")) {
      getParams(data, function (route, querys) {
        playUrl = `https://www.youtube.com/watch?v=${route}`
      })

      openVideo(playUrl)
        .then(() => res.send("succes"))
    } else if (data.includes("netflix")) {
      getParams(data, function (route, querys) {
        const findTrackId = (element) => element === "trkid";
        playUrl = `https://www.netflix.com/watch/${route}?trackId=${querys[querys.findIndex(findTrackId) + 1]}`
      })

      openVideo(playUrl)
        .then(() => res.send("succes"))
    } else res.send("Didn't receive a correct link")
  } else res.send("Didn't receive a link")
}

let openVideo = (url) => new Promise((resolve, reject) => {
  open(url)
    .then(resolve())
})

let getParams = function (data, result) {
  let array = data.split(" ")

  let url = ""
  let querysArray = ""
  let route = ""

  array.forEach(element => {
    if (element.includes("http")) url = element
  });
  let urlArray = url.split("/")
  let routeAndQuerys = urlArray[urlArray.length - 1].split("?")
  route = routeAndQuerys[0]
  if (routeAndQuerys.length >= 2) {
    let querys = routeAndQuerys[1]
    querysArray = querys.split(/[=&]/g)
  }
  result(route, querysArray);
};

exports.fullscreen = function (req, res) {
  robot.moveMouse(x, y);
  robot.mouseClick();
  robot.mouseClick();
  res.send("succes")
}

exports.forward = function (req, res) {
  robot.keyTap("right")
  res.send("succes")
}

exports.backward = function (req, res) {
  robot.keyTap("left")
  res.send("succes")
}

exports.close = function (req, res) {
  robot.keyTap("w", "control")
  res.send("succes")
}

exports.play = function (req, res) {
  robot.moveMouse(x, y);
  robot.mouseClick();
  res.send("succes")
}

exports.louder = function (req, res) {
  robot.keyTap("up")
  res.send("succes")
}

exports.quieter = function (req, res) {
  robot.keyTap("down")
  res.send("succes")
}