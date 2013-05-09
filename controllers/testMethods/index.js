var Test = require(process.cwd() + '/models/Test'),
    basicAuth = require(process.cwd() + '/lib/basicAuth'),
    error = require(process.cwd() + '/lib/error');


/*
 * GET /tests
 */
exports.index = function(req, res, next){

    if (!req.isAuthenticated()) {
        var privateDoc = false;
        basicAuth.authenticate(req, privateDoc, function(err, user){
            if (err) return next(err);
            index(user._id);
        });
    } else {
        index(req.user._id);
    }

    function index(id){
        var skip = req.query.offset || 0,
            limit = req.query.limit || '',
            select = req.query.select || '';

        if (select) {
            if (!Test.inSchema(select))
                return next(new error.BadRequest());
            select = '_id ' + select.replace(/,/g, ' ');
        }

        Test.find({user: id}).select(select).sort('-created').skip(skip).limit(limit).exec(function(err, docs){
            if (err) return next(err);
            res.setHeader('Content-Type', 'application/json');
            res.send(docs);
        });
    }
};