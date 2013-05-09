phantom = require('phantom');

module.exports = function(test, callback){
    return phantom.create(function(ph){
        return ph.createPage(function(page){
            page.set('viewportSize', {width: 224, height: 280});
            page.set('zoomFactor', 0.2);
            page.set('clipRect', {top: 0, left: 0, width: 224, height: 280});
            return page.open(test.url, function(status){
                return setTimeout((function(){
                    page.render('public/screenshots/' + test._id + '.png');
                    test.image = test._id;
                    callback();
                }), 1000);
            });
        });
    });
};


