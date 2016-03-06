(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($rootScope, $window, UserService) {
        var vm = this;

        vm.video1 = "p4rEQz3qw8U";
        vm.user = null;
        $rootScope.currentUser = null;;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.currentUser = user
            });
        }
    }

})();