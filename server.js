const cors = require('cors');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
port = process.env.PORT || 6969;

// use body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// listen to port
app.listen(port);

//cors
app.use(cors())

console.log('API server started on: ' + port);

var routes = require('./app/routes/appRoutes'); //importing route
routes(app); //register the route