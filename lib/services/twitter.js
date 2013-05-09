var request = require('request');

module.exports = function(test, callback){
    return request({uri: 'http://urls.api.twitter.com/1/urls/count.json?url=' + test.url}, function(err, res, body){
        if (err) return callback(err);

        var stats = eval('(' + body + ')');
        test.result.links.social.twitter = stats.count || 0;
        callback();
    });
};