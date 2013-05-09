var express = require('express'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongo')(express),
    config = require('./config.json');

exports.configure = function(app, passport){

    /*
     * Configuring the development environment
     */
    app.configure('development', function(){
        app.set('db uri', config.development.db);
        app.use(express.static(process.cwd() + '/test/angular'));
    });


    /*
     * Configuring the testing environment
     */
    app.configure('test', function(){
        app.set('db uri', config.test.db);
        app.use(express.static(process.cwd() + '/test/angular'));
    });


    /*
     * Configuring the production environment
     */
    app.configure('production', function(){
        app.set('db uri', config.production.db);
    });


    /*
     * Configuration common to all environments
     */
    app.configure(function(){
        app.engine('.html', require('ejs').__express);
        app.set('view engine', 'html');
        app.set('views', process.cwd() + '/layouts');
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.static(process.cwd() + '/public'));
        app.use(express.session({
            secret: 'nodeseo_secret_123',
            store: new mongoStore({
                url: app.get('db uri'),
                collection: 'sessions'
            })
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
        app.use(require(process.cwd() + '/middleware/error')());
        app.use(require(process.cwd() + '/middleware/error404')());
    });

};

exports.connect = function(app){
    mongoose.connect(app.get('db uri'), function(err){
        if (err) console.log(err);
    });
};