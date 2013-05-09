(function(){
    'use strict';

    /*
     * Test Controller (/tests/:test/edit)
     */
    angular.module('nodeseo.controllers').controller('TestEditController', ['$scope', '$routeParams', 'Test', 'Page', function($scope, $routeParams, Test, Page){
        Page.setTitle('Editace testu');
        Page.setCurrentItem('edit');
        Page.setLayout('twoColumnsB');

        $scope.test = {};
        var test = Test.get({test: $routeParams.test}, function(){
            var testInfo = {
                _id: test._id,
                hostname: test.hostname
            };
            Page.setTestInfo(testInfo);
            $scope.test = test;
        });

        $scope.update = function(){
            Test.update({test: $routeParams.test}, $scope.test, function(){
                $scope.success = true;
                $('html,body').animate({scrollTop: $("body").offset().top}, 'slow');
            });
        };
    }]);
})();