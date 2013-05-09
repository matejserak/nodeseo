(function(){
    'use strict';

    /*
     * Test Controller (/tests/:test/tab3)
     */
    angular.module('nodeseo.controllers').controller('TestTab3Controller', ['$scope', '$routeParams', 'Test', 'Page', function($scope, $routeParams, Test, Page){
        Page.setTitle('Odkazy');
        Page.setCurrentItem('tab3');
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

            var linksData = [];
            var row = {};
            for (var i=0; i<test.result.links.linkTest.length; i++) {
                var t = test.result.links.linkTest[i];
                row = {
                    url: '<a href="'+t.url+'" title="'+t.url+'" target="_blank">'+t.hostname+'</a>',
                    title: t.title,
                    internal: t.internal === true ? 'interní' : 'externí',
                    follow: t.follow === true ? 'follow' : 'nofollow',
                    response: t.response+' ms',
                    code: t.code
                };
                linksData.push(row);
            }
            $scope.linksData = linksData;
        });
        $scope.test = test;

        /**
         * DataTable
         */

        // Callback prida na radky tridu podle navratoveho kodu
        $scope.rowCallback = function(nRow){
            var code = $("td:last", nRow).text();
            $(nRow).addClass("code" + code);
        };
        $scope.columnDefs = [
            { "mDataProp": "url", "aTargets": [0]},
            { "mDataProp": "title", "aTargets": [1] },
            { "mDataProp": "internal", "aTargets": [2] },
            { "mDataProp": "follow", "aTargets": [3] },
            { "mDataProp": "response", "aTargets": [4] },
            { "mDataProp": "code", "aTargets": [5] }
        ];

    }]);

})();