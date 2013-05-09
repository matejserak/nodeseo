(function(){
    'use strict';


    /*
     * User Controller (/profiles/:user)
     */
    angular.module('nodeseo.controllers').controller('UserController', ['$scope', '$routeParams',  '$location', 'User', 'Test', 'Page', function($scope, $routeParams, $location, User, Test, Page){
        Page.setTitle('Profil uživatele');
        Page.setCurrentItem('');
        Page.setLayout('oneColumn');

        $scope.user = {};
        var user = User.get({user: $routeParams.user}, function(){
            $scope.user = user;
            $scope.user.password = '';
        });

        $scope.update = function(){
            if ($scope.user.password.length < 6) {
                $scope.info = {
                    message: 'Heslo musí mít alespoň 6 znaků',
                    type: 'warning'
                };
            } else if (!$scope.password2) {
                $scope.info = {
                    message: 'Hesla se musí shodovat',
                    type: 'warning'
                };
            }
            else {
                User.update({user: $routeParams.user}, $scope.user, function(response){
                    $scope.user.name = response.doc.name;
                    $scope.user.authKey = response.doc.authKey;
                    $('#loggedUser').text(response.doc.name);
                    $scope.info = {
                        message: 'Změny byly úspěšně provedeny',
                        type: 'success'
                    };
                }, function(){
                    $scope.info = {
                        message: 'Změny se nepodařilo provést',
                        type: 'warning'
                    };
                });
            }
        };

        $scope.remove = function(){
            $location.path('/');
            Test.removeAll();
            User.remove({user: $routeParams.user});
            window.location.href = $location.absUrl() + 'login?del';
        };

    }]);
})();