var Test = require(process.cwd() + '/models/Test');

describe('model Test', function(){

    describe('metoda inSchema', function(){
        it('vrati true, pokud se pole ve schema nachazi', function(){
            Test.inSchema('url, word1').should.equal(true);
            Test.inSchema('neexistujici, word1').should.equal(false);
        });
    });

});