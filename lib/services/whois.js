var request = require('request'),
    cheerio = require('cheerio'),
    util = require(process.cwd() + '/lib/util');

module.exports = function(test, callback){
    return request({uri: 'http://who.is/whois/' + test.hostname}, function(err, res, body){
        if (err) return callback(err);

        $ = cheerio.load(body);
        if ($('.important-dates').length) {
            var data = $(".important-dates th:contains('Registered On')").next().text().replace(',', '').split(' ');
            test.result.other.domainRegistered = util.getDomainAge(data, 1);
            callback();
        }
        else if ($("td:contains('registered:')").length) {
            var data = $("td:contains('registered:')").text().split("\n");
            test.result.other.domainRegistered = util.getDomainAge(data, 2);
            callback();
        }
        else if ($(".registrar-information td:contains('created:')").length) {
            var data = $(".registrar-information td:contains('created:')").text().split("\n");
            test.result.other.domainRegistered = util.getDomainAge(data, 3);
            callback();
        } else {
            callback();
        }
    });
};