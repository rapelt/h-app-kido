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

    HeaderController.$inject = ['UserService', '$rootScope'];
    function HeaderController(UserService, $rootScope) {
        var vm = $rootScope;
        vm.user = null;
        $rootScope.isLoggedIn = false;

        initController();

        function initController() {
            console.log($rootScope);
            if($rootScope.isLoggedIn){
                loadCurrentUser();
            }
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

    }

})();