var request = require('request'),
    cheerio = require('cheerio');

module.exports = function(test, callback){
    return request({uri: 'http://www.google.com/search?q=site:' + test.hostname + '&ie=utf-8&oe=utf-8&aq=t&client=firefox-a'}, function(err, res, body){
        if (err) return callback(err);

        $ = cheerio.load(body);

        var countResults = $('#resultStats').text() || '',
            intRegex = /^\d+$/,
            result = '';
        for (var i = 0; i < countResults.length; i++) {
            if (intRegex.test(countResults[i])) {
                result += countResults[i];
            }
        }
        test.result.search.indexCount.google = result || 0;

        $('li.g').each(function(){
            test.result.search.firstResults.google.push({
                title: $(this).find('h3').text(),
                desc: $(this).find('.st').text(),
                href: $(this).find('h3 a').attr('href'),
                shortHref: $(this).find('cite').text()
            });
        });
        callback();
    });
};
