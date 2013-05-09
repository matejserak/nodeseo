var basicAuth = require(process.cwd() + '/lib/basicAuth'),
    error = require(process.cwd() + '/lib/error');


/*
 * GET /tests/:test
 */
exports.show = function(req, res, next){

    if (!req.isAuthenticated()) {
        var privateDoc = true;
        basicAuth.authenticate(req, privateDoc, function(err){
            if (err) return next(err);
            show();
        });
    } else {
        show();
    }

    function show(){
        res.setHeader('Content-Type', 'application/json');
        res.send(req.test);
    }

};