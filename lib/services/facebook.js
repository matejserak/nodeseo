var request = require('request');

module.exports = function(test, callback){
    var query = 'SELECT share_count, like_count, comment_count FROM link_stat WHERE url = "' + test.url + '"';
    return request({uri: 'https://api.facebook.com/method/fql.query?format=json&query=' + encodeURIComponent(query)}, function(err, res, body){
        if (err) return callback(err);

        var stats = eval('(' + body + ')');
        test.result.links.social.facebook.share = stats[0].share_count || 0;
        test.result.links.social.facebook.like = stats[0].like_count || 0;
        test.result.links.social.facebook.comment = stats[0].comment_count || 0;
        callback();
    });
};