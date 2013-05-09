var express = require('express'),
    resource = require('express-resource'),
    passport = require('passport'),
    init = require('./config/init'),
    testController = require('./controllers/testController'),
    userController = require('./controllers/userController'),
    app = express();

// Configuration
init.configure(app, passport);
init.connect(app);

// Passport
require('./config/passport')(passport);

// Routes
require('./config/routes')(app, userController);

// Resource
var base = '/api/';
app.resource('tests', testController, {base: base});
app.resource('profiles', userController, {base: base});
app.del(base + 'tests', testController.destroyAll);

module.exports = app;