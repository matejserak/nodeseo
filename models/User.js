var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var fields = {
    name: String,
    email: String,
    hashedPassword: String,
    salt: String,
    authKey: String,
    active: { type: Boolean, default: false }
};

var UserSchema = new Schema(fields);

UserSchema.virtual('password')
    .set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){
        return this._password;
    });

UserSchema.path('name').validate(function(name){
    return name.length;
});

UserSchema.path('email').validate(function(email){
    return email.length;
});

UserSchema.path('hashedPassword').validate(function(hashedPassword){
    return hashedPassword.length;
});

UserSchema.pre('save', function(next){

    this.authKey = new Buffer(this._id + ':' + this.hashedPassword).toString('base64');

    if (this.password && this.password.length)
        next();
    else
        next(new Error('Neplatné heslo'));
});

UserSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    makeSalt: function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: function(password){
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

UserSchema.statics.inDB = function(email, cb){
    return this.findOne({email: email}, function(err, user){
        if (!user) return cb(null, user);
        cb(new Error('Uživatel s tímto e-mailem již existuje'), user);
    });
};

module.exports = mongoose.model('User', UserSchema);