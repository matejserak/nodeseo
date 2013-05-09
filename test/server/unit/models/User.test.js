var mocco = require('mocco'),
    User = require(process.cwd() + '/models/User');

describe('model User', function(){

    describe('metoda inDB', function(){
        it('zavola metodu findOne() s podminkou pro vyber testu podle e-mailu', function(){
            mocco.mock(User).hijack(function findOne(email){
                email.should.eql({email: 'serakmat@fit.cvut.cz'});
            });
            User.inDB('serakmat@fit.cvut.cz', function(){});
            mocco.restore();
        });
    });

});