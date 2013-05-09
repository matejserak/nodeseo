var error = require(process.cwd() + '/middleware/error404');

describe('middleware error404', function(){

    it('vyrenderuje se layout error a nastavi se status kod na 404', function(){
        var req = {
            url: "",
            headers: {
                host: ""
            }
        };
        var res = {
            status: function(code){},
            render: function(layout, data) {
                layout.should.eql('error'),
                data.status.should.eql(404)
            }
        };
        var next = function() {};
        error()(req, res, next);
    });

});