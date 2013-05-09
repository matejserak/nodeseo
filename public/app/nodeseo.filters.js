(function(){
    'use strict';

    /*
     * Filtry
     */

    var module = angular.module('nodeseo.filters', []);

    module.filter('daysFromNow', function(){
        return function(data){
            return data ? moment().diff(moment(data), 'days') : '';
        };
    });

    module.filter('round', function(){
        return function(data){
            return data ? Math.round(data) : '';
        };
    });

    module.filter('encodeURIComponent', function(){
        return function(data){
            return data ? encodeURIComponent(data) : '';
        };
    });

    module.filter('percentage', function(){
        return function(data, total){
            return (data && total) ? (data / total * 100) : 0;
        };
    });

    module.filter('checkLength', function(){
        return function(data, limits){
            if (data && limits[0] && limits[1]) {
                if (data.length < limits[0]) return '<span class="warning">' + data.length + ' znaků (příliš málo znaků)</span>';
                else if (data.length > limits[1]) return '<span class="warning">' + data.length + ' znaků (příliš mnoho znaků)</span>';
                return '<span class="success">' + data.length + ' znaků (optimální délka)</span>';
            }
            return '<span class="error">0 znaků (chybí!)</span>';
        };
    });

    module.filter('translate', function(){
        return function(data, type){
            if (type) {
                switch (type) {
                    case 'indexing':
                        return data ? 'povolena' : 'zakázána';
                    case 'sitemap':
                        return data ? 'existuje' : 'možná neexistuje';
                    case 'robots':
                        return data ? 'existuje' : 'neexistuje';
                    case 'sem_word':
                        return data ? 'překontrolujte' : 'v pořádku';
                    case 'sem_table':
                        return data ? 'překontrolujte' : 'v pořádku';
                    case 'sem_frame':
                        return data ? 'překontrolujte' : 'v pořádku';
                    default:
                        return data;
                }
            }
        };
    });

    module.filter('translateElement', function(){
        return function(data){
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(data) != -1) {
                return 'Nadpis ' + data.toUpperCase();
            } else if (data === 'p') {
                return 'Odstavec';
            }
            return data;
        };
    });

    module.filter('alexa', function(){
        return function(data){
            if (data) {
                return (data == 10000 || data == 100000) ? 0 : data;
            }
        };
    });

    module.filter('countLinks', function(){
        return function(data, type){
            var count = 0;
            if (data && type) {
                for (var i = 0; i < data.length; i++) {
                    if ((data[i].follow == type[0]) && (data[i].internal == type[1])) {
                        count++;
                    }
                }
                return count;
            }
        };
    });

    module.filter('language', function(){
        return function(data){
            if (data) {
                var lang = '(' + data + ')';
                switch (data) {
                    case 'cs':
                        return 'čeština ' + lang;
                    case 'de':
                        return 'němčina ' + lang;
                    case 'en':
                        return 'angličtina ' + lang;
                    default:
                        return data;
                }
            }
        };
    });

})();