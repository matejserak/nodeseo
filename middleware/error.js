module.exports = function(){
    return function(err, req, res, next){
        var status = err.status || 500,
            message = err.message || 'Vyskytla se chyba',
            username = req.user ? req.user.name : '',
            userID = req.user ? req.user._id : '';

        /*
        if ((status != 404) && (process.env.NODE_ENV !== 'test')) {
            console.log(err);
        }
        */

        res.status(status);
        return res.render('error', {status: status, title: message, url: 'http://' + req.headers.host + req.url, username: username, userID: userID});
    };
};