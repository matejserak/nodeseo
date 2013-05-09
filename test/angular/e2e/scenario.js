// guide: http://docs.angularjs.org/guide/dev_guide.e2e-testing

(function(){
    'use strict';

    var scenario = true;

    describe('nodeseo', function(){

        describe('Úvodní strana', function(){
            beforeEach(function(){
                browser().navigateTo('/');
            });
            it('zobrazí úvodní stránku', function(){
                expect(element('title').text()).toBe('Úvodní strana');
            });
        });

        describe('Nový test', function(){
            beforeEach(function(){
                browser().navigateTo('/tests/new');
            });
            it('zobrazí formulář pro vytvoření nového testu', function(){
                expect(element('title').text()).toBe('Nový test');
            });

            it('otestuje z(ne)aktivnění tlačítka pro odeslání', function(){
                expect(element('.form-actions .btn-success').css('display')).toBe('none');

                input('test.url').enter('http://fit.cvut.cz');
                input('test.word1').enter('slovo1');
                input('test.word2').enter('slovo1');

                expect(element('.form-actions .btn-success').css('display')).toBe('block');
            });
        });

        describe('Seznam testů', function(){
            beforeEach(function(){
                browser().navigateTo('/tests');
            });

            it('zobrazí seznam provedených testů a přejde na detail testu', function(){
                var repeater = using('table tbody').repeater('tr');
                expect(repeater.count()).toBe(3);

                element('tbody a:first').click();
                expect(element('.heading').text()).toBe('Přehled');
            });
        });

        describe('Editace testu', function(){
            beforeEach(function(){
                browser().navigateTo('/tests');
            });

            it('přejde na detail testu, který edituje', function(){
                element('tbody tr:first .btn-warning').click();
                expect(element('.heading').text()).toBe('Editace testu');

                expect(element('#pageRank').val()).toBe('0');
                input('test.result.other.ranks.pageRank').enter('3');
                element('.btn-warning').click();

                browser().reload();
                expect(element('#pageRank').val()).toBe('3');
            });
        });

        describe('Vymazání testu', function(){
            beforeEach(function(){
                browser().navigateTo('/tests');
            });

            it('vymaže nejnovější test', function(){
                element('tbody tr:first .btn-inverse').click();
                element('.confirmbutton-yes').click();

                var repeater = using('table tbody').repeater('tr');
                expect(repeater.count()).toBe(2);
            });
        });

        /*
        describe('Přihlášení', function(){
            beforeEach(function(){
                browser().navigateTo('/login');
            });

            it('úspěšně přihlásí uživatele', function(){
                input('email').enter('enabled@user.cz');
                input('password').enter('123456');
                element('.btn-success').click();
                browser().reload();
                expect(input('email').val()).toBe('enabled@user.cz');
                expect(element('.title').text()).toBe('Úvodní strana');
            });

        });
*/

        describe('Zobrazení', function(){

            describe('Login', function(){
                beforeEach(function(){
                    browser().navigateTo('/login');
                });

                it('zobrazí stránku pro přihlášení', function(){
                    expect(element('h3').text()).toBe('Přihlášení');
                });

            });

            describe('Reset', function(){
                beforeEach(function(){
                    browser().navigateTo('/reset');
                });

                it('zobrazí stránku pro zaslání zapomenutého hesla', function(){
                    expect(element('h3').text()).toBe('Zapomenuté heslo');
                });

            });

            describe('Registrace', function(){
                beforeEach(function(){
                    browser().navigateTo('/signup');
                });

                it('zobrazí stránku pro vytvoření registrace', function(){
                    expect(element('h3').text()).toBe('Registrace');
                });

            });

        });

    });
})();