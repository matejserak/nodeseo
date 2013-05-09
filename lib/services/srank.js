var xmlrpc = require('xmlrpc');

module.exports = function(test, callback){
    var client = xmlrpc.createClient({ host: 'srank.seznam.cz', port: 80, path: '/'});
    return client.methodCall('getRank', ['0', test.url, 0], function(err, res){
        if (err) return callback(err);

        test.result.other.ranks.srank = Math.round(res.rank / 25.5);
        callback();
    });
};