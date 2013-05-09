var User = require(process.cwd() + '/models/User'),
    Test = require(process.cwd() + '/models/Test'),
    error = require(process.cwd() + '/lib/error');

/*
 * Basic Access Authentication
 */
exports.authenticate = function(req, privateDoc, cb){

    if (!req.headers.authorization) {
        return cb(new error.Unauthorized(), "");
    }

    var token = req.headers.authorization.split(/\s+/).pop() || '',
        auth = new Buffer(token, 'base64').toString(),
        parts = auth.split(/:/),
        userID = parts[0],
        password = parts[1];

    User.findById(userID, function(err, user){
        if (err || (user.hashedPassword != password)) {
            return cb(new error.Unauthorized(), "");
        }
        // Strict mode enabled - must be a valid user and the user must be the owner of the resource
        if (privateDoc) {
            Test.load(req.params.test, function(err, test){
                if (err || (test.user.hashedPassword != password) || (test.user._id != userID)) {
                    return cb(new error.Forbidden(), "");
                }
                cb(null, test);
            });
            // Strict mode disabled - user have to be only logged in
        } else {
            cb(null, user);
        }
    });
};