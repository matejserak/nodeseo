module.exports = function(){
    return function(req, res, next){
        var username = req.user ? req.user.name : '',
            userID = req.user ? req.user._id : '';

        res.status(404);
        return res.render('error', {status: 404, title: 'Stránka nebyla nalezena', url: 'http://' + req.headers.host + req.url, username: username, userID: userID});
    };
};