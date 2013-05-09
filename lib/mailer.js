var nodemailer = require('nodemailer'),
    config = require(process.cwd() + '/config/config.json');


/*
 * Configuration
 */
var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: config.global.gmailLogin,
        pass: config.global.gmailPass
    }
});


/*
 * Sending activation link via e-mail
 */
exports.activate = function(user, host, cb){

    if (process.env.NODE_ENV === 'test')
        return cb(null, "");

    smtpTransport.sendMail({
        from: 'NODESEO <'+config.global.gmailLogin+'>',
        to: user.name + ' <' + user.email + '>',
        subject: 'Aktivace účtu',
        html: '<div style="margin:0;padding:0;font-size:12px;width:542px;border:3px solid #F8F8F8">' +
            '<div style="margin:0;padding:0;font-size:12px;width:540px;border:1px solid #EDEDED">' +
            '<div style="margin:0;padding:0;font-size:12px;width:510px;background: #2B2B2B;color:#3693CF;' +
            'font-weight:bold;padding:25px 15px;font-size:24px">NODE<span style="color:#EB5A32">SEO</span></div>' +
            '<div style="margin:0;padding:0;font-size:12px;width:510px;padding:25px 15px 60px 15px">' +
            '<h1 style="margin:0;padding:0;font-size:12px;background:#3693CF;padding:10px;color:#fff;text-transform:uppercase">Aktivace účtu</h1>' +
            '<p style="margin:30px 0"><strong>Aktivaci účtu dokončíte klinutím na tento na odkaz:</strong><br><br>' +
            '<a href="http://' + host + '/activate/' + user._id + '">http://' + host + '/activate/' + user._id + '</a></p>' +
            '</div></div></div>'

    }, function(err, res){
        if (err) return cb(err, null);
        cb(null, res);
    });
};


/*
 * Sending new password via e-mail
 */
exports.reset = function(user, password, cb){

    if (process.env.NODE_ENV === 'test')
        return cb(null, "");

    smtpTransport.sendMail({
        from: 'NODESEO <'+config.global.gmailLogin+'>',
        to: user.name + ' <' + user.email + '>',
        subject: 'Nové heslo',
        html: '<div style="margin:0;padding:0;font-size:12px;width:542px;border:3px solid #F8F8F8">' +
            '<div style="margin:0;padding:0;font-size:12px;width:540px;border:1px solid #EDEDED">' +
            '<div style="margin:0;padding:0;font-size:12px;width:510px;background: #2B2B2B;color:#3693CF;' +
            'font-weight:bold;padding:25px 15px;font-size:24px">NODE<span style="color:#EB5A32">SEO</span></div>' +
            '<div style="margin:0;padding:0;font-size:12px;width:510px;padding:25px 15px 60px 15px">' +
            '<h1 style="margin:0;padding:0;font-size:12px;background:#3693CF;padding:10px;color:#fff;text-transform:uppercase">Nové heslo pro přihlášení</h1>' +
            '<p style="margin:30px 0"><strong>Vaše nové heslo je:</strong><br><br>' +
            '<em>' + password + '</em>' +
            '</div></div></div>'

    }, function(err, res){
        if (err) return cb(err, null);
        cb(null, res);
    });
};