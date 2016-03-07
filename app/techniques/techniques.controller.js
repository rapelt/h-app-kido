(function () {
    'use strict';

    angular
        .module('app')
        .controller('Techniques.TechniquesController', Controller);

    function Controller($window, $rootScope, $state, TechniqueService, FlashService, GradeService, UserService) {
        var vm = this;

        vm.removeWhiteSpace = removeWhiteSpace;
        vm.removeWhiteSpaceId = removeWhiteSpaceId;


        vm.user = {};

        vm.techniques = []

        vm.techniqueSets = [];

        vm.sets = [];

        vm.availableGrades = [];
        vm.filterBy = filterBy;

        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                vm.availableGrades = GradeService.GetAvaliableGrades(vm.user.grade.grade);
                vm.availableGrades.unshift({grade: "all", displayName: "All"});
                TechniqueService.GetAll().then(function (techniques){
                    vm.techniques =_.filter(techniques, function(technique){
                        if(GradeService.UserCanSeeAsset(technique.grade.grade, vm.user.grade.grade)){
                            return technique;
                        }
                    });
                    vm.techniqueSets = _.groupBy(vm.techniques, function(technique){ return technique.techniqueSet });

                    vm.sets = Object.getOwnPropertyNames(vm.techniqueSets);
                });
            });
        }

        function removeWhiteSpace(str){
            return str.replace(/\s+/g, '');

        }

        function removeWhiteSpaceId(str){
            return '#' + str.replace(/\s+/g, '');

        }

        function filterBy(grade){
            if(grade.grade === "all"){
                var gradeTechniques =_.filter(vm.techniques, function(technique){
                    if(GradeService.UserCanSeeAsset(technique.grade.grade, vm.user.grade.grade)){
                        return technique;
                    }
                });
            } else {
                var gradeTechniques = _.filter(vm.techniques, function (technique) {
                    if (GradeService.FilterByGrade(grade, technique.grade)) {
                        return technique;
                    }
                });
            }
            vm.techniqueSets = _.groupBy(gradeTechniques, function(technique){ return technique.techniqueSet });
            vm.sets = Object.getOwnPropertyNames(vm.techniqueSets);
        }

    }

})();