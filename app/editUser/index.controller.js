(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditUser.IndexController', Controller);

    function Controller($window, $rootScope, $state, UserService, FlashService) {
        var vm = this;

        $rootScope.currentUser = null;;

        vm.user = null;
        vm.editUser = editUser;
        vm.deleteUser = deleteUser;
        vm.allUsers = [];
        vm.refresh = refresh;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.currentUser = user;
            });

            UserService.GetAll().then(function (users){
                vm.allUsers = users;
            })
        }

        function deleteUser(id) {
            UserService.Delete(id)
                .then(function () {
                    refresh();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function editUser(user) {
            $rootScope.editUser = user;
        }

        function refresh() {
            $state.reload();
        }
    }

})();