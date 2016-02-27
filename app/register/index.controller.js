(function () {
    'use strict';

    angular
        .module('app')
        .controller('Register.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.create = createUser;

        initController();

        function initController() {
        }

        function createUser() {
            UserService.Create(vm.user)
                .then(function () {
                    FlashService.Success('User created');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();