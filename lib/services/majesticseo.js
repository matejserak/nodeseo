var request = require('request'),
    cheerio = require('cheerio');

module.exports = function(test, callback){
    return request({uri: 'http://www.majesticseo.com/reports/site-explorer/summary/' + test.hostname + '?IndexDataSource=F'}, function(err, res, body){
        if (err) return callback(err);

        $ = cheerio.load(body);
        test.result.links.backlinks.total = $("p:contains('External Backlinks')").next().text().trim().replace(/,/g, '') || 0;
        test.result.links.backlinks.uniqueDomain = $("p:contains('Referring Domains')").next().text().trim().replace(/,/g, '') || 0;
        test.result.links.backlinks.uniqueIP = $("p:contains('addresses')").find('b:nth-child(2)').text().trim().replace(/,/g, '') || 0;
        test.result.links.backlinks.uniqueCsite = $("p:contains('Class C subnets')").find('b:nth-child(2)').text().trim().replace(/,/g, '') || 0;
        callback();
    });
};