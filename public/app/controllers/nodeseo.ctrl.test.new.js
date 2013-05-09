(function(){
    'use strict';

    /*
     * Test Controller (/tests/new)
     */
    angular.module('nodeseo.controllers').controller('TestNewController', ['$scope', '$location', '$timeout', 'Test', 'Page', function($scope, $location, $timeout, Test, Page){
        Page.setTitle('Nový test');
        Page.setCurrentItem('novy');
        Page.setLayout('oneColumn');

        $scope.counter = 0;
        $scope.onTimeout = function(){
            $scope.counter++;
            var timeout = $timeout($scope.onTimeout,1000);
        };

        $scope.test = {};
        $scope.create = function(){
            $scope.counter = 0;
            $timeout($scope.onTimeout, 1000);
            $('.left-sidebar .widget').addClass('overlay');
            Test.save($scope.test, function(response){
                $location.path("tests/"+response.doc._id);
            }, function(){
                $('.left-sidebar .widget').removeClass('overlay');
                $scope.invalid = true;
                $timeout.cancel(timeout);
            });
        };
    }]);

})();