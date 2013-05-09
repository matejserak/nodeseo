(function(){
    'use strict';

    var module = angular.module('nodeseo', [
        'nodeseo.controllers',
        'nodeseo.filters',
        'nodeseo.directives',
        'nodeseo.services',
        'ui',
        'ui.bootstrap'
    ]);


    /*
     * Routy
     */
    module.config(function routes($routeProvider){
        $routeProvider.when('/', {templateUrl: '/views/index.html', controller: 'IndexController'});
        $routeProvider.when('/tests', {templateUrl: '/views/test_list.html', controller: 'TestsController', reloadOnSearch: true});
        $routeProvider.when('/tests/new', {templateUrl: '/views/test_new.html', controller: 'TestNewController'});
        $routeProvider.when('/tests/:test', {templateUrl: '/views/test_tab1.html', controller: 'TestTab1Controller', reloadOnSearch: false});
        $routeProvider.when('/tests/:test/tab2', {templateUrl: '/views/test_tab2.html', controller: 'TestTab2Controller', reloadOnSearch: false});
        $routeProvider.when('/tests/:test/tab3', {templateUrl: '/views/test_tab3.html', controller: 'TestTab3Controller', reloadOnSearch: false});
        $routeProvider.when('/tests/:test/tab4', {templateUrl: '/views/test_tab4.html', controller: 'TestTab4Controller', reloadOnSearch: false});
        $routeProvider.when('/tests/:test/edit', {templateUrl: '/views/test_edit.html', controller: 'TestEditController'});
        $routeProvider.when('/tests/:test/print', {templateUrl: '/views/test_print.html', controller: 'TestPrintController', reloadOnSearch: false});
        $routeProvider.when('/profiles/:user', {templateUrl: '/views/user.html', controller: 'UserController'});
        $routeProvider.otherwise({redirectTo: '/'});
    });


    /*
     * HTML5 History API
     */
    module.config(function url($locationProvider){
        $locationProvider.html5Mode(true);
    });

})();