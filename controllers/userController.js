var User = require(process.cwd() + '/models/User'),
    renderController = require(process.cwd() + '/controllers/renderController'),
    mailer = require(process.cwd() + '/lib/mailer'),
    basicAuth = require(process.cwd() + '/lib/basicAuth'),
    error = require(process.cwd() + '/lib/error'),
    passport = require('passport');


/*
 * Load user via URL
 */
exports.load = function(req, id, cb){
    User.findById(id, function(err, user){
        if (err || !user) return cb(new error.NotFound(), '');
        cb(null, user);
    });
};


/*
 * GET /profiles/:user
 */
exports.show = function(req, res, next){
    if (!req.isAuthenticated()) {
        return next(new error.Unauthorized());
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(req.user);
    }
};


/*
 * PUT /profiles/:user
 */
exports.update = function(req, res, next){
    if (!req.isAuthenticated()) {
        return next(new error.Unauthorized());
    } else {
        for (var key in req.body) {
            req.user[key] = req.body[key];
        }
        req.user.save(function(err, doc){
            if (err) return next(err);
            res.setHeader('Content-Type', 'application/json');
            res.send(200, { doc: doc });
        });
    }
};


/*
 * DELETE /profiles/:user
 */
exports.destroy = function(req, res, next){
    if (!req.isAuthenticated()) {
        return next(new error.Unauthorized());
    } else {
        req.user.remove(function(err, doc){
            if (err) return next(err);
            res.send(204);
        });
    }
};


/*
 * Generating and sending a new password
 */
exports.reset = function(req, res, next){
    User.findOne({ email: req.body.email }, function(err, user){
        if (err || !user) {
            req.flash('error', 'Uživatel s tímto účtem neexistuje');
            return renderController.renderForm('reset')(req, res);
        }
        user.password = (new Date().valueOf() + Math.floor((Math.random() * 999999999) + 1)).toString();
        user.active = true;
        user.save(function(err){
            if (err) return next(err);
            mailer.reset(user, user.password, function(err){
                if (err) {
                    req.flash('error', 'Odeslání e-mailu s heslem se nezdařilo');
                    return renderController.renderForm('reset')(req, res);
                }
                req.flash('error', 'Nové heslo bylo zasláno na e-mail. Můžete se přihlásit.');
                req.flash('type', 'success');
                req.flash('email', req.body.email);
                return res.redirect('/login');
            });
        });
    });
};


/*
 * Login
 */
exports.login = function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', info.message);
            req.flash('email', req.body.email);
            return renderController.renderForm('login')(req, res);
        }
        if (user.active) {
            req.logIn(user, function(err){
                if (err) return next(err);
                return res.redirect('/');
            });
        } else {
            req.flash('error', 'Účet je třeba nejprve aktivovat odkazem v e-mailu');
            return renderController.renderForm('login')(req, res);
        }
    })(req, res, next);
};


/*
 * Logout
 */
exports.logout = function(req, res){
    req.logout();
    res.redirect('/login');
};


/*
 * Account activation
 */
exports.activate = function(req, res){
    User.findByIdAndUpdate(req.params.id, { active: true }, function(err){
        if (err) {
            req.flash('error', 'Uživatel s tímto účtem neexistuje');
        } else {
            req.flash('error', 'Účet je aktivní. Můžete se přihlásit.');
            req.flash('type', 'success');
        }
        return res.redirect('/login');
    });
};


/*
 * Create a new user
 */
exports.signup = function(req, res){
    var user = new User(req.body);
    User.inDB(req.body.email, function(err){

        /*
         * The user is already in the DB
         */
        if (err) {
            req.flash('error', err.message);
            return renderController.renderForm('signup')(req, res);
        }

        /*
         * User is not registered yet
         */
        user.save(function(err){
            if (err) {
                return res.render('signup', { message: 'Všechny položky jsou povinné', type: 'warning', user: user });
            }
            mailer.activate(user, req.headers.host, function(err){
                if (err) {
                    req.flash('error', 'Odeslání aktivačního e-mailu se nezdařilo');
                } else {
                    req.flash('error', 'Na e-mail byl poslán aktivační link');
                    req.flash('type', 'success');
                }
                return renderController.renderForm('signup')(req, res);
            });
        });
    });
};