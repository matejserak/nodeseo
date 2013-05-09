var https = require('https'),
    config = require(process.cwd() + '/config/config.json');

module.exports = function mobile(test, type, callback){
    type = type || 'desktop';

    var key = config.global.pageSpeedApiKey,
        locale = config.global.pageSpeedLocale,
        pageSpeedResults = '';

    var get = {
        host: 'www.googleapis.com',
        path: '/pagespeedonline/v1/runPagespeed?url=' + encodeURIComponent(test.url) +
            '&key=' + key + '&strategy=' + type + '&locale=' + locale + '&prettyprint=false'
    };

    return https.get(get,function(res){
        res.on('data', function(data){
            pageSpeedResults += data;
        });
        res.on('end', function(err){
            test.result.pageSpeed[type] = eval('(' + pageSpeedResults + ')');
            callback();
        });
    }).on('error',function(err){
            return callback(err);
        }).end();
};