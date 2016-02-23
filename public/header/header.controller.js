(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderController', HeaderController)
        .directive('header', function(){
            return {
                restrict: 'E',
                templateUrl: 'header/header.view.html',
                controller: 'HeaderController'
            }
        });

    HeaderController.$inject = ['UserService', '$rootScope', 'AuthenticationService'];
    function HeaderController(UserService, $rootScope, AuthenticationService) {
        var vm = $rootScope;
        vm.user = null;
        $rootScope.isLoggedIn = false;
        $rootScope.logout = logout;
        $rootScope.user = null;


        initController();

        function initController() {
            console.log($rootScope.isLoggedIn);
            if($rootScope.isLoggedIn){
                loadCurrentUser();
            }
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    $rootScope.user = user;
                });
        }

        function logout(){
            console.log("loggedout");
            AuthenticationService.ClearCredentials();
            $rootScope.isLoggedIn = false;
        }

    }

})();