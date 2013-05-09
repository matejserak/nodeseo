var app = require(process.cwd() + '/app'),
    User = require(process.cwd() + '/models/User'),
    request = require('supertest'),
    mongoose = require('mongoose');

var id1 = mongoose.Types.ObjectId(),
    id2 = mongoose.Types.ObjectId();

var count;

var usersData = [
    {_id: id1, name: "Enabled User", email: "enabled@user.cz", password: "123456", active: true},
    {_id: id2, name: "Disabled User", email: "disabled@user.cz", password: "123456", active: false}
];

describe('Users', function(){
    beforeEach(function(done){
        User.remove({}, function(err){
            if (err) return done(err);
            new User(usersData[0]).save();
            new User(usersData[1]).save();
            done();
        });
    });

    describe('aktivace uctu uzivatele', function(){

        it('skonci neuspesne', function(done){
            request(app)
                .get('/activate/' + id2)
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res){
                    User.findById(id2, function(err, user){
                        user.active.should.equal(true);
                    });
                    done();
                });
        });

    });

    describe('prihlaseni uzivatele', function(){

        it('neexistujiciho - skonci neuspesne', function(done){
            request(app)
                .post('/login')
                .field('email', 'nonsense@nonsense.cz')
                .field('password', 'nonsense')
                .expect(200)
                .end(function(err, res){
                    res.text.should.include('Uživatel s tímto e-mailem neexistuje');
                    done();
                });
        });

        it('existujiciho ale neaktivniho - skonci neuspesne', function(done){
            request(app)
                .post('/login')
                .field('email', 'disabled@user.cz')
                .field('password', '123456')
                .expect(200)
                .end(function(err, res){
                    res.text.should.include('Účet je třeba nejprve aktivovat odkazem v e-mailu');
                    done();
                });
        });

        it('existujiciho a aktivniho - skonci prihlasenim', function(done){
            request(app)
                .post('/login')
                .field('email', 'enabled@user.cz')
                .field('password', '123456')
                .expect(302)
                .expect('Location', '/')
                .end(done);
        });

    });

    describe('zaslani zapomenuteho hesla pro uzivatele', function(){

        it('neexistujiciho - skonci neuspesne', function(done){
            request(app)
                .post('/reset')
                .field('email', 'nonsense@nonsense.cz')
                .expect(200)
                .end(function(err, res){
                    res.text.should.include('Uživatel s tímto účtem neexistuje');
                    done();
                });
        });

        it('existujiciho - skonci uspesne', function(done){
            request(app)
                .post('/reset')
                .field('email', 'enabled@user.cz')
                .expect(302)
                .expect('Location', '/login')
                .end(done);
        });

    });

    describe('registrace uzivatele', function(){

        before(function(done){
            User.count(function(err, cnt){
                count = cnt;
                done();
            });
        });

        it('neregistrovaneho - skonci uspesne', function(done){
            request(app)
                .post('/signup')
                .field('name', 'new@user.cz')
                .field('email', 'new@user.cz')
                .field('password', '123456')
                .expect(200)
                .end(function(err, res){
                    res.text.should.include('Na e-mail byl poslán aktivační link');
                    User.count(function(err, cnt){
                        cnt.should.equal(count + 1);
                        done();
                    });
                });
        });

        it('jiz registrovaneho - skonci neuspesne', function(done){
            request(app)
                .post('/signup')
                .field('name', 'enabled@user.cz')
                .field('email', 'enabled@user.cz')
                .field('password', '123456')
                .expect(200)
                .end(function(err, res){
                    res.text.should.include('Uživatel s tímto e-mailem již existuje');
                    done();
                });
        });

    });

});