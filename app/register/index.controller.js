(function () {
    'use strict';

    angular
        .module('app')
        .controller('Register.IndexController', Controller);

    function Controller($window, $state, $rootScope, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.create = createUser;

        initController();

        function initController() {
            if($rootScope.editUser != null){
                vm.user = $rootScope.editUser;
            }
        }

        function createUser() {
            if($rootScope.editUser != null){
                UserService.Update(vm.user)
                    .then(function () {
                        FlashService.Success('User updated');
                        $rootScope.editUser = null;
                        $state.reload();
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                        $rootScope.editUser = null;

                    });
            } else {
                UserService.Create(vm.user)
                    .then(function () {
                        FlashService.Success('User created');
                        $state.reload();
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
        }
    }

})();