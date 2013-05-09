var Test = require(process.cwd() + '/models/Test'),
    basicAuth = require(process.cwd() + '/lib/basicAuth'),
    error = require(process.cwd() + '/lib/error'),
    util = require(process.cwd() + '/lib/util'),
    http = require('http'),
    async = require('async');


/*
 * POST /tests
 */
exports.create = function(req, res, next){

    if (!req.isAuthenticated()) {
        var privateDoc = false;
        basicAuth.authenticate(req, privateDoc, function(err, user){
            if (err) return next(err);
            create(user._id);
        });
    } else {
        create(req.user._id);
    }

    function create(id){
        http.globalAgent.maxSockets = 150;

        var test = new Test(req.body);
        test.user = id;

        if (!req.is('json')) return next(new error.UnsupportedMediaType());

        if ((!util.isWord(test.word1)) || (!util.isWord(test.word2)) || (!util.isUrl(test.url)))
            return next(new error.BadRequest());

        util.httpSwitcher(test.url).get(test.url,function(response){

            if ([200, 301, 302].indexOf(response.statusCode) >= 0) {

                test.url = response.headers.location ? response.headers.location : test.url;
                test.hostname = util.getHostname(test.url);
                test.basicUrl = util.getBasicUrl(test.url);

                async.parallel([

                    // Screenshot
                    function(callback){
                        process.env.NODE_ENV = 'production';
                        if (process.env.NODE_ENV == 'production') {
                            callback();
                        } else {
                            require(process.cwd() + '/lib/services/phantom')(test, callback);
                        }
                    },

                    // Test the availability of links, get some information about the site, etc.
                    function(callback){
                        require(process.cwd() + '/lib/services/siteinfo')(test, callback);
                    },

                    // W3C validator
                    function(callback){
                        require(process.cwd() + '/lib/services/w3c')(test, callback);
                    },

                    // Domain Age - who.is
                    function(callback){
                        require(process.cwd() + '/lib/services/whois')(test, callback);
                    },

                    // Majestic SEO
                    function(callback){
                        require(process.cwd() + '/lib/services/majesticseo')(test, callback);
                    },

                    // Google PageSpeed - Desktop
                    function(callback){
                        require(process.cwd() + '/lib/services/pagespeed')(test, 'desktop', callback);
                    },

                    // Google PageSpeed - Mobile
                    function(callback){
                        require(process.cwd() + '/lib/services/pagespeed')(test, 'mobile', callback);
                    },

                    // Facebook API
                    function(callback){
                        require(process.cwd() + '/lib/services/facebook')(test, callback);
                    },

                    // AlexaRank
                    function(callback){
                        require(process.cwd() + '/lib/services/alexarank')(test, callback);
                    },

                    // Number of pages in the index of Seznam and first 10 results
                    function(callback){
                        require(process.cwd() + '/lib/services/seznam')(test, callback);
                    },

                    // Number of pages in the index of Google and first 10 results
                    function(callback){
                        require(process.cwd() + '/lib/services/google')(test, callback);
                    },

                    // Google Plus
                    function(callback){
                        require(process.cwd() + '/lib/services/googleplus')(test, callback);
                    },

                    // Twitter
                    function(callback){
                        require(process.cwd() + '/lib/services/twitter')(test, callback);
                    },

                    // PageRank
                    function(callback){
                        require(process.cwd() + '/lib/services/pagerank')(test, callback);
                    },

                    // Test whether sitemap exists
                    function(callback){
                        require(process.cwd() + '/lib/services/sitemap')(test, callback);
                    },

                    // S-Rank
                    function(callback){
                        require(process.cwd() + '/lib/services/srank')(test, callback);
                    }

                ], function(err){
                    if (err) return next(err);

                    test.save(function(err, doc){
                        if (err) return next(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.setHeader('Location', 'http://' + req.headers.host + '/' + doc._id);
                        res.send(201, { doc: doc });
                    });
                });

            } else {
                return next(new error.BadRequest());
            }
        }).on('error', function(err){
                return next(new error.BadRequest());
            });
    }
};