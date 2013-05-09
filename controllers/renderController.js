var userController = require(process.cwd() + '/controllers/userController'),
    testController = require(process.cwd() + '/controllers/testController');


function renderUser(){
    return function(req, res, next){
        userController.load(req, req.params.id, function(err){
            if (err) return next(err);
            render()(req, res);
        });
    };
}


function renderTest(){
    return function(req, res, next){
        testController.load(req, req.params.id, function(err){
            if (err) return next(err);
            render()(req, res);
        });
    };
}


function renderForm(layout){
    var layout = layout || 'login';
    return function(req, res){
        if (req.query.del !== undefined) {
            req.flash('error', 'Účet byl úspěšně smazán (vč. historie testů)');
            req.flash('type', 'success');
        }
        res.render(layout, {
            message: req.flash('error') || '',
            type: req.flash('type') || 'warning',
            email: req.flash('email') || '',
            user: req.body
        });
    };
}


function render(){
    return function(req, res){
        var username = req.user ? req.user.name : '',
            userID = req.user ? req.user._id : '';
        res.render('layout', {username: username, userID: userID});
    };
}


module.exports = {
    renderUser: renderUser,
    renderTest: renderTest,
    renderForm: renderForm,
    render: render
};