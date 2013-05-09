var error = require(process.cwd() + '/middleware/error'),
    UnsupportedMediaType = require(process.cwd() + '/lib/error').UnsupportedMediaType;

describe('middleware error', function(){

    it('vyrenderuje se layout error a nastavi se spravny status kod', function(){
        var err = new UnsupportedMediaType();
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
                data.status.should.eql(415)
            }
        };
        var next = function() {};
        error()(err, req, res, next);
    });

});
