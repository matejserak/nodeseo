(function(){
    'use strict';

    /*
     * Test Controller (/tests/:test/tab2)
     */
    angular.module('nodeseo.controllers').controller('TestTab2Controller', ['$scope', '$routeParams', 'Test', 'Page', function($scope, $routeParams, Test, Page){
        Page.setTitle('Obsah');
        Page.setCurrentItem('tab2');
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

            $scope.test.total = {};
            for (var i in test.result.body.keywordCount) {
                var sum = 0;
                for (var j in test.result.body.keywordCount[i]) {
                    sum += test.result.body.keywordCount[i][j];
                }
                $scope.test.total[i] = sum;
            }
            var lok = test.result.other.ranks.alexaRankCountry;
            $scope.test.geo = (lok !== 'lok.') ? lok : 'CZ';
        });
        $scope.test = test;

    }]);

})();