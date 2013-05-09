(function(){
    'use strict';

    /*
     * Test Controller (/tests)
     */
    angular.module('nodeseo.controllers').controller('TestsController', ['$scope', '$routeParams', '$location', 'Test', 'Page', function($scope, $routeParams, $location, Test, Page){
        Page.setTitle('Historie provedených testů');
        Page.setCurrentItem('historie');
        Page.setLayout('oneColumn');

        var limit = 10;
        var tests = Test.query({select: ['url', 'word1', 'word2', 'created']}, function(){
            var testsLentgh = tests.length || 1;
            $scope.noOfPages = Math.ceil(testsLentgh / limit);
        });
        $scope.tests = tests;
        $scope.currentPage = 1;
        $scope.maxSize = 7;

        $scope.$watch('currentPage', function(){
            var currentPage = $scope.currentPage || 1;
            var offset = (currentPage * limit) - limit;
            $scope.tests = Test.query({ offset: offset, limit: limit, select: ['url', 'word1', 'word2', 'created'] });
        });

        $scope.remove = function(slug){
            Test.remove({test: slug}, function(){
                $location.path('/tests');
                $scope.tests = Test.query({ offset: 0, limit: 10, select: ['url', 'word1', 'word2', 'created'] });
                $scope.currentPage = 1;
                $scope.success = "Test byl úspěšně smazán";
            });
        };

        $scope.removeAll = function(){
            Test.removeAll(function(){
                $location.path('/tests');
                $scope.tests.length = 0;
                $scope.noOfPages = 1;
                $scope.currentPage = 1;
                $scope.success = "Historie byla úspěšně vymazána";
            });
        };

    }]);

})();