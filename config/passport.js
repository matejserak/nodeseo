var User = require(process.cwd() + '/models/User'),
    LocalStrategy = require('passport-local').Strategy;


/*
 * Setting the strategy for Passport
 */
module.exports = function(passport){

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done){
            User.findOne({ email: email }, function(err, user){
                if (err) return done(err);

                if (!user)
                    return done(null, false, { message: 'Uživatel s tímto e-mailem neexistuje' });

                if (!user.authenticate(password))
                    return done(null, false, { message: 'Zadali jste nesprávné heslo' });

                return done(null, user);
            });
        }
    ));

};