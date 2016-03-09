(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditUser.IndexController', Controller);

    function Controller($window, $rootScope, $state, UserService, FlashService, GradeService) {
        var vm = this;

        $rootScope.currentUser = null;;

        vm.user = null;
        vm.editUser = editUser;
        vm.deleteUser = deleteUser;
        vm.allUsers = [];
        vm.refresh = refresh;
        vm.addGrade = addGrade;

        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.currentUser = user;
            });
            refresh();
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
            UserService.GetAll().then(function (users){
                vm.allUsers = users;
            })
        }

        function addGrade(user){
            user.grade = GradeService.AddGrade(user.grade.grade);
            UserService.Update(user);
        }
    }

})();