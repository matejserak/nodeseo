var fs = require('fs'),
    Test = require(process.cwd() + '/models/Test'),
    basicAuth = require(process.cwd() + '/lib/basicAuth'),
    error = require(process.cwd() + '/lib/error');


/*
 * DELETE /tests
 */
module.exports = function(req, res, next){

    if (!req.isAuthenticated()) {
        var privateDoc = false;
        basicAuth.authenticate(req, privateDoc, function(err, user){
            if (err) return next(err);
            deleteAll(user._id);
        });
    } else {
        deleteAll(req.user._id);
    }

    function deleteAll(id){
        Test.find({user: id}).select('image').exec(function(err, tests){
            if (err) return next(err);
            if (tests.length) {
                for (var i = 0; i < tests.length; i++) {
                    if (tests[i]._id == tests[i].image) {
                        fs.unlink(process.cwd() + '/public/screenshots/' + tests[i]._id + '.png', function(err){
                            if (err) next(err);
                        });
                    }
                }
                Test.remove({user: id}).exec(function(err, tests){
                    if (err) return next(err);
                    res.send(204);
                });
            } else {
                res.send(204);
            }
        });
    }
};