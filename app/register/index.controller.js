(function () {
    'use strict';

    angular
        .module('app')
        .controller('Register.IndexController', Controller);

    function Controller($window, $state, $rootScope, UserService, FlashService, GradeService) {
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
            vm.user.grade = GradeService.GetCurrent(vm.user.grade.grade);

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
                vm.user.isFirstLogin = true;
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