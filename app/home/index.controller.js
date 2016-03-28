(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($rootScope, $window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.newPassword = newPassword;
        vm.confirmPassword = "";
        vm.isFL = false;

        initController();



        function initController() {
            // get current user
            if($rootScope.currentUser == null){
                UserService.GetCurrent().then(function (user) {
                    $rootScope.currentUser = user;
                    afterInit(user);

                });
            } else {
                afterInit($rootScope.currentUser);
            }

        }

        function afterInit(user) {
            vm.user = user;
            vm.isFL = vm.user.isFirstLogin;
            if (user.isFirstLogin) {
                $('#myModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#myModal').modal('show')
            } else {
                $('#myModal').modal('hide')

            }
        }

        function newPassword(){
            if(vm.user.password === vm.confirmPassword) {
                $('#myModal').modal('hide')
                vm.user.isFirstLogin = false;
                UserService.Update(vm.user)
                    .then(function () {
                        FlashService.Success('Password updated');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                FlashService.Error("The new password does not match the confirmation password");
            }

        }

    }

})();