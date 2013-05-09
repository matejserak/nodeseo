var request = require('request'),
    cheerio = require('cheerio');

module.exports = function(test, callback){
    return request({uri: 'http://search.seznam.cz/?q=site%3A' + test.hostname}, function(err, res, body){
        if (err) return callback(err);

        $ = cheerio.load(body);
        if ($('#resultCount strong:nth-child(3)').html() !== null) {
            test.result.search.indexCount.seznam = $('#resultCount strong:nth-child(3)').html().replace(/&nbsp;/g, '');
        }

        $('.result').each(function(){
            test.result.search.firstResults.seznam.push({
                title: $('.modText h3', this).text().trim(),
                desc: $('p.description', this).text().trim(),
                href: $('.modText a.url', this).attr('href'),
                shortHref: $('.modText a.url', this).text().trim(),
                imgSrc: $('.modImg img', this).attr('src')
            });
        });
        callback();
    });
};