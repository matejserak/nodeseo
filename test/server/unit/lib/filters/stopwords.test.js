var removeStopWords = require(process.cwd() + '/lib/filters/stopwords');

describe('stopwords filter', function(){
    it('odstrani z retezce stop slova - Default', function(){
        removeStopWords('this is my new car', '').should.eql('car');
    });

    it('odstrani z retezce stop slova - Czech', function(){
        removeStopWords('to je moje nove auto', 'CS').should.eql('moje auto');
    });

    it('odstrani z retezce stop slova - Danish', function(){
        removeStopWords('dette er min nye bil', 'DA').should.eql('er min nye bil');
    });

    it('odstrani z retezce stop slova - German', function(){
        removeStopWords('das ist mein neues auto', 'DE').should.eql('neues auto');
    });

    it('odstrani z retezce stop slova - English', function(){
        removeStopWords('this is my new car', 'EN').should.eql('car');
    });

});