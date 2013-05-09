(function(){
    'use strict';

    /*
     * Test Controller (/tests/:test/tab4)
     */
    angular.module('nodeseo.controllers').controller('TestTab4Controller', ['$scope', '$routeParams', 'Test', 'Page', function($scope, $routeParams, Test, Page){
        Page.setTitle('Rychlost');
        Page.setCurrentItem('tab4');
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

            $scope.test.url = test.url;
            $scope.test.hostname = test.hostname;
            $scope.test._id = test._id;

            function fillArgs(o){
                if (typeof(o) === 'object') {
                    if (o.args && o.format) {
                        for (var i = 1; i <= o.args.length; i++) {
                            var type = o.args[i - 1].type;
                            var value = o.args[i - 1].value;
                            if (type === 'URL') {
                                value = '<a href="' + value + '" title="' + value + '" target="_blank">' + value + '</a>';
                            }
                            o.format = o.format.replace('$' + i, value);
                        }
                    }
                    else {
                        for (var key in o) {
                            if (o.hasOwnProperty(key)) {
                                fillArgs(o[key]);
                            }
                        }
                    }
                }
            }

            fillArgs(test.result.pageSpeed.desktop);
            $scope.desktop = test.result.pageSpeed.desktop;

            fillArgs(test.result.pageSpeed.mobile);
            $scope.mobile = test.result.pageSpeed.mobile;
        });

    }]);

})();