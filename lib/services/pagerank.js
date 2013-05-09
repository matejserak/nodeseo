var pagerank = require('pagerank');

module.exports = function(test, callback){
    return new pagerank(test.url, function(err, pageRank){
        if (err) return callback(err);

        test.result.other.ranks.pageRank = pageRank || 0;
        callback();
    });
};