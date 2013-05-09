var http = require('http');

module.exports = function(test, callback){
    var options = {
        // host: '31.31.75.40',
        // path: '/w3c-validator/check?uri=' + test.url,
        host: 'validator.w3.org',
        path: 'check?uri='+test.url,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    };
    return http.get(options,function(res){
        test.result.other.validity.errors = res.headers['x-w3c-validator-errors'];
        test.result.other.validity.warnings = res.headers['x-w3c-validator-warnings'];
        callback();
    }).on('error', function(err){
            return callback(err);
        });
};