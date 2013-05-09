var Test = require(process.cwd() + '/models/Test'),
    error = require(process.cwd() + '/lib/error');

// Load test via URL
exports.load = function(req, id, cb){
    Test.findById(id, function(err, test){
        if (err || !test) return cb(new error.NotFound(), '');
        cb(null, test);
    });
};

// GET /tests
exports.index = require(process.cwd() + '/controllers/testMethods/index');

// POST /tests
exports.create = require(process.cwd() + '/controllers/testMethods/create');

// GET /tests/:test
exports.show = require(process.cwd() + '/controllers/testMethods/show');

// PUT /tests/:test
exports.update = require(process.cwd() + '/controllers/testMethods/update');

// DELETE /tests/:test
exports.destroy = require(process.cwd() + '/controllers/testMethods/destroy');

// DELETE /tests
exports.destroyAll = require(process.cwd() + '/controllers/testMethods/destroyAll');