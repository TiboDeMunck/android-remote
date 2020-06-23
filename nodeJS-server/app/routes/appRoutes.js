'use strict';
module.exports = function (app) {
  const controller = require('../controller/appController');

  app.route('/video')
    .post(controller.play_video);
  
  app.route('/pressKey')
    .post(controller.press_key)

  app.route('/keys')
    .post(controller.keys)
};