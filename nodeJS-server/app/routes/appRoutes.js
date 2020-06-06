'use strict';
module.exports = function (app) {
  const controller = require('../controller/appController');

  app.route('/video')
    .post(controller.play_video);

  app.route('/fullscreen')
    .get(controller.fullscreen)

  app.route('/forward')
    .get(controller.forward)

  app.route('/backward')
    .get(controller.backward)

  app.route('/close')
    .get(controller.close)

  app.route('/play')
    .get(controller.play)

  app.route('/louder')
    .get(controller.louder)

  app.route('/quieter')
    .get(controller.quieter)

  app.route('/mute')
    .get(controller.mute)

  app.route('/next')
    .get(controller.next)

  app.route('/previous')
    .get(controller.previous)

  app.route('/keys')
    .post(controller.keys)
};