(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, $rootScope, UserService, FlashService) {
        var vm = this;

        $rootScope.currentUser = null;
        vm.confirmPassword = "";

        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.currentUser = user;
            });
        }

        function saveUser() {
            if(vm.user.password === vm.confirmPassword) {
                UserService.Update(vm.user)
                    .then(function () {
                        FlashService.Success('User updated');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                FlashService.Error("The new password does not match the confirmation password");
            }

        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();