var app = require(process.cwd() + '/app'),
    Test = require(process.cwd() + '/models/Test'),
    User = require(process.cwd() + '/models/User'),
    request = require('supertest'),
    async = require('async'),
    mongoose = require('mongoose');

var testId1 = mongoose.Types.ObjectId(),
    testId2 = mongoose.Types.ObjectId(),
    testId3 = mongoose.Types.ObjectId(),
    userId = mongoose.Types.ObjectId();

var testsData = [
    {_id: testId1, user: userId, url: "http://www.domena.cz", word1: "slovo1", word2: "slovo2"},
    {_id: testId2, user: userId, url: "http://www.domena.cz", word1: "slovo1", word2: "slovo2"},
    {_id: testId3, user: userId, url: "http://www.domena.cz", word1: "slovo1", word2: "slovo2"}
];

var userData = {_id: userId, name: "User", email: "test@test.cz", password: "123456", active: true};
var authKey;

function save(doc, cb){
    var test = new Test();
    for (var field in doc) {
        test[field] = doc[field];
    }
    test.save(cb);
}

describe('API', function(){

    beforeEach(function(done){
        User.remove({}, function(err){
            if (err) return done(err);
            new User(userData).save(function(err, user){
                authKey = user.authKey;
                Test.remove({}, function(err){
                    if (err) return done(err);
                    async.each(testsData, save, done);
                });
            });
        });
    });

    describe('GET /api/tests', function(){

        it('vrati 401, pokud uzivatel nema opravneni zobrazit seznam vsech testu', function(done){
            request(app)
                .get('/api/tests')
                .expect(401, done);
        });

        it('vrati seznam vsech testu - vsechna pole', function(done){
            request(app)
                .get('/api/tests')
                .set('Authorization', 'Basic ' + authKey)
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    res.body.length.should.eql(3);
                    res.body[1].should.include({url: "http://www.domena.cz", word1: "slovo1", word2: "slovo2"});
                    done();
                });
        });

        it('vrati predem dany pocet testu - vsechna pole', function(done){
            request(app)
                .get('/api/tests?limit=1&offset=1')
                .set('Authorization', 'Basic ' + authKey)
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    res.body.length.should.eql(1);
                    res.body[0].should.include({url: "http://www.domena.cz", word1: "slovo1", word2: "slovo2"});
                    done();
                });
        });

        it('vrati seznam vsech testu - pouze specifikovana pole', function(done){
            request(app)
                .get('/api/tests?select=url,word1')
                .set('Authorization', 'Basic ' + authKey)
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    res.body.length.should.eql(3);
                    res.body[0].should.not.include({
                        word2: "slovo2"
                    });
                    done();
                });
        });

        it('vrati 400 pri dotazu na pole, ktere neni ve schema', function(done){
            request(app)
                .get('/api/tests?select=nonsense')
                .set('Authorization', 'Basic ' + authKey)
                .expect(400, done);
        });

        it('vrati 406 pri dotazu s formatem jinym nez json', function(done){
            request(app)
                .get('/api/tests?select=nonsense')
                .set('Authorization', 'Basic ' + authKey)
                .set('Accept', 'application/xml')
                .expect(406, done);
        });
    });

    describe('POST /api/tests', function(){

        it('vrati 401, pokud uzivatel nema opravneni vytvorit test', function(done){
            request(app)
                .post('/api/tests')
                .expect(401, done);
        });

        it('vrati 400, pokud zaslana data nejsou validni', function(done){
            request(app)
                .post('/api/tests')
                .set('Authorization', 'Basic ' + authKey)
                .send({})
                .expect(400, done);
        });

        it('vrati 415, pokud zaslana data nejsou v json', function(done){
            request(app)
                .post('/api/tests')
                .set('Authorization', 'Basic ' + authKey)
                .set('Content-Type', 'application/xml')
                .send()
                .expect(415, done);
        });

    });

    describe('PUT /api/tests/:test', function(){

        it('vrati 401, pokud uzivatel nema opravneni editovat test', function(done){
            request(app)
                .put('/api/tests/' + testId1)
                .expect(401, done);
        });

        it('edituje test (vrati 200)', function(done){
            request(app)
                .put('/api/tests/' + testId1)
                .set('Authorization', 'Basic ' + authKey)
                .send({word1: 'jine_slovo'})
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    Test.findOne({word1: 'jine_slovo'}, function(err, doc){
                        if (err) return done(err);
                        doc.word1.should.equal('jine_slovo');
                        done();
                    });
                });
        });

        it('vrati 400, pokud zaslana data nejsou validni', function(done){
            request(app)
                .put('/api/tests/' + testId1)
                .set('Authorization', 'Basic ' + authKey)
                .send({'nonsense': 'nonsense'})
                .expect(400, done);
        });

        it('vrati 404, pokud zdroj neexistuje', function(done){
            request(app)
                .put('/api/tests/nonsense')
                .send({word1: 'jine_slovo'})
                .expect(404, done);
        });

        it('vrati 415, pokud zaslana data nejsou v json', function(done){
            request(app)
                .put('/api/tests/' + testId1)
                .set('Authorization', 'Basic ' + authKey)
                .set('Content-Type', 'application/xml')
                .send()
                .expect(415, done);
        });

    });

    describe('GET /api/tests/:test', function(){

        it('vrati 401, pokud uzivatel nema opravneni zobrazit detail testu', function(done){
            request(app)
                .get('/api/tests/' + testId1)
                .expect(401, done);
        });

        it('vrati detail testu', function(done){
            request(app)
                .get('/api/tests/' + testId1)
                .set('Authorization', 'Basic ' + authKey)
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    res.body._id.should.eql(testId1.toString());
                    res.body.should.include({url: "http://www.domena.cz", word1: "slovo1", word2: "slovo2"});
                    done();
                });
        });

        it('vrati 404, pokud zdroj neexistuje', function(done){
            request(app)
                .get('/api/tests/nonsense')
                .set('Authorization', 'Basic ' + authKey)
                .expect(404, done);
        });
    });

    describe('DELETE /api/tests/:test', function(){

        it('vrati 401, pokud uzivatel nema opravneni smazat test', function(done){
            request(app)
                .del('/api/tests/' + testId1)
                .expect(401, done);
        });

        it('smaze test', function(done){
            request(app)
                .del('/api/tests/' + testId1)
                .set('Authorization', 'Basic ' + authKey)
                .expect(204)
                .end(function(err, res){
                    if (err) return done(err);
                    Test.count({_id: testId1}, function(err, count){
                        if (err) return done(err);
                        count.should.eql(0);
                        done();
                    });
                });
        });

        it('vrati 404, pokud zdroj neexistuje', function(done){
            request(app)
                .del('/api/tests/nonsense')
                .set('Authorization', 'Basic ' + authKey)
                .expect(404, done);
        });

    });

    /*
    describe('DELETE /api/tests', function(){

        it('vrati 401, pokud uzivatel nema opravneni smazat vsechny testy', function(done){
            request(app)
                .del('/api/tests')
                .expect(401, done);
        });

        it('smaze vsechny testy', function(done){
            request(app)
                .del('/api/tests')
                .set('Authorization', 'Basic ' + authKey)
                .expect(204)
                .end(function(err, res){
                    if (err) return done(err);
                    Test.count(function(err, count){
                        if (err) return done(err);
                        count.should.eql(0);
                        done();
                    });
                });
        });

    });
    */

});