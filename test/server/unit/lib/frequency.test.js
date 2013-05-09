var mocco = require('mocco'),
    frequency = require(process.cwd() + '/lib/frequency');

describe('frequency', function(){

    describe('metoda getWordFrequency', function(){
        it('vrati cetnost jednotlivych slov ze stringu()', function(){

            var mock = mocco.mock(frequency);
            mock.hijack(function removeStopWords(text, lang){
                return [ 'aaa', 'bbb' ];
            });

            mock.hijack(function sortWordFrequency(hist){
                return [
                    [ 'aaa', 1 ],
                    [ 'bbb', 1 ]
                ];
            });

            var expectedResult = [
                { word: 'aaa', count: 1 },
                { word: 'bbb', count: 1 }
            ];

            (frequency.getWordFrequency('aaa bbb', 'cs')).should.eql(expectedResult);

            mocco.restore();
        });
    });

    describe('metoda sortWordFrequency', function(){
        it('seradi sestupne slova podle cetnosti', function(){
            var expectedResult = [
                [ 'aaa', 3 ],
                [ 'ccc', 2 ],
                [ 'bbb', 1 ]
            ];
            (frequency.sortWordFrequency({ aaa: 3, bbb: 1, ccc: 2 })).should.eql(expectedResult);
        });
    });

});