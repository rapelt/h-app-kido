(function () {
    'use strict';

    angular
        .module('app')
        .controller('Manuals.ManualsController', Controller);

    function Controller($rootScope, GradeService, UserService, DocumentService) {
        var vm = this;

        vm.user = {};

        vm.documents = {};

        vm.availableGrades = [];

        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                $rootScope.currentUser = user;
                vm.availableGrades = GradeService.GetAvaliableGrades(vm.user.grade.grade);
                vm.availableGrades.unshift({grade: "all", displayName: "All"});
                DocumentService.GetAll().then(function (documents){
                    vm.documents =_.filter(documents, function(documents){
                        if(GradeService.UserCanSeeAsset(documents.grade.grade, vm.user.grade.grade)){
                            return documents;
                        }
                    });
                });
            });
        }
    }

})();