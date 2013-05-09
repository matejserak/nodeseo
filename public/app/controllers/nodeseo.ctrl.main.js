(function(){
    'use strict';

    var module = angular.module('nodeseo.controllers', []);

    /*
     * Main Controller
     */
    module.controller('MainCtrl', ['$scope', 'Page', function($scope, Page){
        $scope.page = Page;
    }]);

    module.controller('IndexController', ['Page', function(Page){
        Page.setTitle('Úvodní strana');
        Page.setCurrentItem('');
        Page.setLayout('oneColumn');
    }]);

})();