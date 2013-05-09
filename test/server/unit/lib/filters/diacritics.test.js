var removeDiacritics = require(process.cwd() + '/lib/filters/diacritics');

describe('diacritics filter', function(){
    it('odstrani z retezce diakritiku', function(){
        removeDiacritics('Příliš žluťoučký kůň úpěl ďábelské ódy').should.eql('Prilis zlutoucky kun upel dabelske ody');
    });
});