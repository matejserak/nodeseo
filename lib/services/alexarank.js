var request = require('request'),
    cheerio = require('cheerio');

module.exports = function(test, callback){
    return request({uri: 'http://data.alexa.com/data?cli=10&dat=s&url=' + test.url}, function(err, res, body){
        if (err) return callback(err);

        $ = cheerio.load(body, { xmlMode: true, lowerCaseTags: true });
        test.result.other.ranks.alexaRankGlobal = $('REACH').attr('RANK') || 100000;
        test.result.other.ranks.alexaRankLocal = $('COUNTRY').attr('RANK') || 10000;
        test.result.other.ranks.alexaRankCountry = $('COUNTRY').attr('CODE') || 'lok.';
        callback();
    });
};