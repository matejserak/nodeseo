var fs = require('fs'),
    Test = require(process.cwd() + '/models/Test'),
    basicAuth = require(process.cwd() + '/lib/basicAuth'),
    error = require(process.cwd() + '/lib/error');


/*
 * DELETE /tests/:test
 */
exports.destroy = function(req, res, next){

    if (!req.isAuthenticated()) {
        var privateDoc = true;
        basicAuth.authenticate(req, privateDoc, function(err){
            if (err) return next(err);
            destroy();
        });
    } else {
        destroy();
    }

    function destroy(){
        Test.findById(req.params.test, function(err){
            if (err) return next(new error.NotFound());
        });

        if (req.test._id == req.test.image) {
            fs.unlink(process.cwd() + '/public/screenshots/' + req.test._id + '.png', function(err){
                if (err) next(err);
            });
        }
        req.test.remove(function(err, doc){
            if (err) return next(err);
            res.send(204);
        });
    }

};