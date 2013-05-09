var util = require(process.cwd() + '/lib/util');

describe('utils', function(){

    it('zkontroluje, zda slovo ma alespon 3 znaky a neobsahuje carku ani mezeru', function(){
        util.isWord('slovo').should.eql(true);
        util.isWord('ne slovo').should.eql(false);
    });

    it('zkontroluje validitu url', function(){
        util.isUrl('http://www.seznam.cz/').should.eql(true);
        util.isUrl('www.seznam.cz').should.eql(false);
    });

    it('vrati slug stranky', function(){
        util.getSlug('http://www.seznam.cz/st/img/2011/logo.png').should.eql('logo.png');
        util.getSlug('http://www.seznam.cz/?123').should.eql('?123');
    });

    it('vrati doctype', function(){
        util.getDoctype({0: {children: {0: {data: '!DOCTYPE html'}}}}).should.eql('HTML5');
        util.getDoctype({0: {children: {0: {data: 'html'}}}}).should.eql('HTML5');
        util.getDoctype({0: {children: {0: {data: '!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'}}}}).should.eql('XHTML 1.0 Strict');
    });

    it('vrati datum registrace domeny', function(){
        var data = [
            'registrar:    REG-WEDOS\r',
            'registered:   18.11.2008 09:59:13\r',
            'registrar:    REG-WEDOS\r',
            'created:      18.11.2008 09:51:17\r'];
        util.getDomainAge(data).should.be.an.instanceOf(Date);
        util.getDomainAge(data).should.eql(new Date('2008-11-18'));
    });

});