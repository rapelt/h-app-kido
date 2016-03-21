(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditUser.IndexController', Controller);

    function Controller($window, $rootScope, $state, UserService, FlashService, GradeService) {
        var vm = this;

        $rootScope.currentUser = null;;

        vm.user = null;
        vm.userForEdit = {};
        vm.deleteUser = deleteUser;
        vm.allUsers = [];
        vm.refresh = refresh;
        vm.addGrade = addGrade;
        vm.create = create;
        vm.dismiss = dismiss;
        var isEdit = false;
        vm.editUser = editUser;
        var index = -1;


        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.currentUser = user;
            });
            refresh();
        }

        function dismiss(user) {
            if(isEdit == true) {
                UserService.GetById(user._id)
                    .then(function (newUser) {
                        vm.allUsers[index] = newUser;
                    })
            }
            vm.userForEdit = null;

        }

        function editUser(user, indexs) {
            vm.userForEdit = user;
            isEdit = true;
            index = indexs;
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

        function refresh() {
            UserService.GetAll().then(function (users){
                vm.allUsers = users;
            })
        }

        function addGrade(user){
            user.grade = GradeService.AddGrade(user.grade.grade);
            UserService.Update(user);
        }

        function create() {
            vm.userForEdit.grade = GradeService.GetCurrent(vm.userForEdit.grade.grade);
            if(isEdit == true){
                UserService.Update(vm.userForEdit)
                    .then(function () {
                        FlashService.Success('User updated');
                        isEdit = false;
                        refresh();
                        vm.userForEdit = null;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                vm.userForEdit.isFirstLogin = true;
                UserService.Create(vm.userForEdit)
                    .then(function () {
                        FlashService.Success('User created');
                        refresh();
                        vm.userForEdit = null;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }

        }
    }

})();