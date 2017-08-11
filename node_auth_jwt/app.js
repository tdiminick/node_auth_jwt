const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// set up express app
const app = express();
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

// log requests to console
app.use(logger('dev'));

// parse incoming data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }));

// get all the api(i think) routes
require('./server/routes')(app);
// catch all route - this will eventually be for html and need error
app.get('*', (req, res) => res.status(200).send({
    message: 'start of app'
}));

module.exports = app;