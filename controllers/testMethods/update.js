var Test = require(process.cwd() + '/models/Test'),
    basicAuth = require(process.cwd() + '/lib/basicAuth'),
    error = require(process.cwd() + '/lib/error');


/*
 * PUT /tests/:test
 */
exports.update = function(req, res, next){

    if (!req.isAuthenticated()) {
        var privateDoc = true;
        basicAuth.authenticate(req, privateDoc, function(err){
            if (err) return next(err);
            update();
        });
    } else {
        update();
    }

    function update(){
        if (!req.is('json')) return next(new error.UnsupportedMediaType());

        Test.findById(req.params.test, function(err, obj){
            if (err) return next(new error.NotFound());
        });

        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if (!Test.inSchema(key)) return next(new error.BadRequest());
                req.test[key] = req.body[key];
            }
        }

        req.test.save(function(err, doc){
            if (err) return next(err);
            res.setHeader('Content-Type', 'application/json');
            res.send(200, { doc: doc });
        });
    }
};