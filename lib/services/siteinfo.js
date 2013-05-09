var request = require('request'),
    cheerio = require('cheerio'),
    async = require('async'),
    dns = require('dns'),
    http = require('http'),
    util = require(process.cwd() + '/lib/util'),
    frequency = require(process.cwd() + '/lib/frequency');

module.exports = function(test, callback){
    return request({uri: test.url}, function(err, res, body){
        if (err) return callback(err);

        $ = cheerio.load(body);
        var bodyPlainText = $('body').text().trim();
        var lang = $('meta[http-equiv="content-language"]').attr('content') || $('meta[http-equiv="Content-Language"]').attr('content') || '';

        test.result.head.charset = $('meta[http-equiv="content-type"]').attr('content') || $('meta[http-equiv="Content-Type"]').attr('content') || '';
        if (test.result.head.charset) test.result.head.charset = test.result.head.charset.match(/.*=(.*)$/)[1];

        async.parallel([
            function(cb){
                test.result.body.wordFrequency = frequency.getWordFrequency(bodyPlainText, lang);
                cb();
            },
            function(cb){
                var wordCount = frequency.removeStopWords(bodyPlainText, lang);
                test.result.body.wordCount = wordCount.length;
                cb();
            },
            function(cb){
                test.result.head.description = $('meta[name="description"]').attr('content') || '';
                test.result.body.semantics.nestedTable = $('table table').length ? true : false;
                test.result.body.semantics.frame = $('frame').length ? true : false;
                test.result.body.semantics.highlight = ($('b').length || $('i').length) ? true : false;

                test.result.head.doctype = util.getDoctype($.root());

                var index = $('meta[name="robots"]').attr('content') || '';
                test.result.head.indexing = ((index).indexOf('noindex') == -1) && (index).indexOf('nofollow') == -1;
                cb();
            },
            function(cb){
                util.httpSwitcher(test.basicUrl).get(test.basicUrl + 'robots.txt',function(response){
                    test.result.head.robots = ([200, 302].indexOf(response.statusCode) >= 0);
                    cb();
                }).on('error', function(err){
                        return cb(err);
                    });
            },
            function(cb){
                var elements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
                    words = [test.word1.toLowerCase(), test.word2.toLowerCase()];

                for (var k = 0; k < words.length; k++) {
                    var elementsCount = [0, 0, 0, 0, 0, 0, 0];
                    for (var i = 0; i < elements.length; i++) {
                        $(elements[i]).each(function(){
                            var element = $(this).text().trim();
                            if ((element.length > 0) && (k === 0)) {
                                test.result.body.elements[elements[i]].push(element);
                            }
                            element = element.toLowerCase();
                            if (element.indexOf(words[k]) != -1) {
                                elementsCount[i]++;
                            }
                        });
                    }
                    test.result.body.keywordCount[k] = {
                        h1: elementsCount[0], h2: elementsCount[1], h3: elementsCount[2],
                        h4: elementsCount[3], h5: elementsCount[4], h6: elementsCount[5],
                        p: elementsCount[6]
                    };
                }

                $('img[src]').each(function(){
                    var imgLink = util.getFullUrl(test.url, $(this).attr('src'));
                    test.result.body.images.push({
                        url: imgLink,
                        slug: util.getSlug(imgLink),
                        alt: $(this).attr('alt') || ''
                    });
                });

                $('script[src]').each(function(){
                    var srcLink = util.getFullUrl(test.url, $(this).attr('src'));
                    test.result.other.js.push({
                        url: srcLink,
                        slug: util.getSlug(srcLink)
                    });
                });

                $('link[rel="stylesheet"][href]').each(function(){
                    var hrefLink = util.getFullUrl(test.url, $(this).attr('href'));
                    test.result.other.css.push({
                        url: hrefLink,
                        slug: util.getSlug(hrefLink)
                    });
                });
                cb();
            },
            function(cb){
                var linksURLs = [],
                    linksComplex = [];
                $('a[href]:not([href^=mailto],[href^=https])').each(function(){
                    var hrefLink = util.getFullUrl(test.url, $(this).attr('href')),
                        hostname = util.getHostname(hrefLink),
                        link = {
                            url: hrefLink,
                            hostname: hostname,
                            title: $(this).attr('title') || '',
                            internal: hostname === test.hostname,
                            follow: $(this).attr('rel') !== 'nofollow',
                            response: 0,
                            code: 'ERR'
                        };
                    if ((linksComplex.length < http.globalAgent.maxSockets - 100) && linksURLs.indexOf(hrefLink) === -1) {
                        linksURLs.push(hrefLink);
                        linksComplex.push(link);
                    }
                });

                if (linksComplex.length) {
                    var start = [],
                        counter = 0;
                    for (var i = 0; i < linksComplex.length; i++) {
                        dns.resolve4(linksComplex[i].hostname, function(index, err){
                            if (err) {
                                if (counter++ == linksComplex.length - 1) {
                                    cb();
                                }
                            } else {
                                start[linksComplex[index]] = new Date();
                                util.httpSwitcher(linksComplex[index].url).get(linksComplex[index].url, function(index, site, res){
                                        linksComplex[index].response = new Date() - start[linksComplex[index]];
                                        linksComplex[index].code = res.statusCode;
                                        test.result.links.linkTest = linksComplex;
                                        if (counter++ == linksComplex.length - 1) {
                                            cb();
                                        }
                                    }.bind(this, index, linksComplex[index].url)).on('error', function(err){
                                        return cb(err);
                                    });
                            }
                        }.bind(this, i));
                    }
                } else {
                    cb();
                }
            }

        ], function(err){
            if (err) {
                return callback(err);
            }

            callback();
        });
    });
};