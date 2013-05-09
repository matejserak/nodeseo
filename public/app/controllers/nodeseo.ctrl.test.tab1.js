(function(){
    'use strict';

    /*
     * Test Controller (/tests/:test)
     */
    angular.module('nodeseo.controllers').controller('TestTab1Controller', ['$scope', '$routeParams', 'Test', 'Page', function($scope, $routeParams, Test, Page){
        Page.setTitle('Přehled');
        Page.setCurrentItem('tab1');
        Page.setLayout('twoColumns');

        $scope.test = {};
        var test = Test.get({test: $routeParams.test}, function(){
            var testInfo = {
                _id: test._id,
                hostname: test.hostname,
                url: test.url,
                image: test.image,
                pageRank: test.result.other.ranks.pageRank,
                srank: test.result.other.ranks.srank,
                alexaRankLocal: test.result.other.ranks.alexaRankLocal,
                alexaRankGlobal: test.result.other.ranks.alexaRankGlobal,
                alexaRankCountry: test.result.other.ranks.alexaRankCountry
            };

            Page.setTestInfo(testInfo);
        });
        $scope.test = test;

    }]);

})();