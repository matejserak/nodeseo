(function(){
    'use strict';

    /*
     * Services
     */

    var module = angular.module('nodeseo.services', ['ngResource']);

    module.factory('Test', function($resource){
        return $resource('/api/tests/:test', {}, {
            update: {method: 'PUT'},
            removeAll: {method: 'DELETE', isArray: true}
        });
    });

    module.factory('User', function($resource){
        return $resource('/api/profiles/:user', {}, {
            update: {method: 'PUT'}
        });
    });

    module.factory('Page', function(){
        var title = 'Úvodní strana';
        var currentItem = '';
        var layout = '';
        var testInfo = {};
        return {
            title: function(){
                return title;
            },
            currentItem: function(){
                return currentItem;
            },
            layout: function(){
                return layout;
            },
            testInfo: function(){
                return testInfo;
            },
            setTitle: function(newTitle){
                title = newTitle;
            },
            setLayout: function(newLayout){
                layout = newLayout;
            },
            setCurrentItem: function(newCurrentItem){
                currentItem = newCurrentItem;
            },
            setTestInfo: function(newTestInfo){
                testInfo = newTestInfo;
            }
        };
    });

})();