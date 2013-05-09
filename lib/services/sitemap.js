util = require(process.cwd() + '/lib/util');

module.exports = function(test, callback){
    return util.httpSwitcher(test.basicUrl).get(test.basicUrl + 'sitemap.xml',function(res){
        test.result.head.sitemap = ([200, 302].indexOf(res.statusCode) >= 0);
        callback();
    }).on('error', function(err){
            return callback(err);
        });
};