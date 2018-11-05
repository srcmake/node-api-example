var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// From: https://stackoverflow.com/questions/37640129/accept-only-json-content-type-in-a-post-or-put-request-in-expressjs
// Accept only application/json
app.use(bodyParser.json({ type: 'application/json' }));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Store our all_routes file in the variable named "routes".
var routes = require('./routes/all_routes');

// Tell our server to use the all_routes file for all incoming requests that start with "/".
app.use('/', routes);

// Connect to Mongo here.
const mongoose = require('mongoose');
const db = require('./config/config').mongoURI;

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB successfully connected.'))
    .catch(err => console.log(`Failed to connect to DB. Error: ${err}`));

module.exports = app;