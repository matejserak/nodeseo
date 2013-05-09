var renderController = require(process.cwd() + '/controllers/renderController');

module.exports = function(app, userController){

    /*
     * Check whether the user is logged
     */
    app.all('*', function(req, res, next){
        if (/^\/signup/g.test(req.url) || (/^\/login/g.test(req.url)) || (/^\/activate/g.test(req.url)) || (/^\/reset/g.test(req.url)) || (/^\/api/g.test(req.url))) {
            return next();
        } else if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    });


    /*
     * Actions
     */
    app.get('/logout', userController.logout);
    app.get('/activate/:id', userController.activate);
    app.post('/login', userController.login);
    app.post('/reset', userController.reset);
    app.post('/signup', userController.signup);


    /*
     * Render
     */
    app.get('/', renderController.render());
    app.get('/tests', renderController.render());
    app.get('/tests/new', renderController.render());
    app.get('/tests/:id', renderController.renderTest());
    app.get('/tests/:id/edit', renderController.renderTest());
    app.get('/tests/:id/tab2', renderController.renderTest());
    app.get('/tests/:id/tab3', renderController.renderTest());
    app.get('/tests/:id/tab4', renderController.renderTest());
    app.get('/tests/:id/print', renderController.renderTest());
    app.get('/profiles/:id', renderController.renderUser());
    app.get('/login', renderController.renderForm('login'));
    app.get('/reset', renderController.renderForm('reset'));
    app.get('/signup', renderController.renderForm('signup'));

};