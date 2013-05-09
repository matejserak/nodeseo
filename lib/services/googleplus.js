var https = require('https'),
    cheerio = require('cheerio');

module.exports = function(test, callback){
    var htmlData = '';
    return https.get({ hostname: 'plusone.google.com', path: '/u/0/_/+1/fastbutton?url=' + test.url },function(res){
        res.on('data', function(data){
            htmlData += data;
        });
        res.on('end', function(err){
            $ = cheerio.load(htmlData);
            test.result.links.social.googlePlus = $('#aggregateCount').text().trim() || 0;
            callback();
        });
    }).on('error',function(err){
            return callback(err);
        }).end();
};


