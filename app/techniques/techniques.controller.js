(function () {
    'use strict';

    angular
        .module('app')
        .controller('Techniques.TechniquesController', Controller);

    function Controller($window, $rootScope, $state, TechniqueService, FlashService, GradeService, UserService) {
        var vm = this;

        vm.removeWhiteSpace = removeWhiteSpace;
        vm.removeWhiteSpaceId = removeWhiteSpaceId;

        vm.filters = ['Grade', 'Techniques'];
        vm.user = {};

        vm.techniques = []

        vm.techniqueSets = [];

        vm.sets = [];

        vm.availableGrades = [];
        vm.filterBy = filterBy;
        vm.filterByType = filterByType;


        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                $rootScope.currentUser = user;
                vm.availableGrades = GradeService.GetAvaliableGrades(vm.user.grade.grade);
                vm.availableGrades.unshift({grade: "all", displayName: "All"});
                TechniqueService.GetAll().then(function (techniques){
                    vm.techniques =_.filter(techniques, function(technique){
                        if(GradeService.UserCanSeeAsset(technique.grade.grade, vm.user.grade.grade)){
                            if(technique.assetType === "video"){
                                return technique;
                            }
                        }
                    });
                    setTechniquesForDisplay();
                });
            });
        }

        function setTechniquesForDisplay(){
            vm.techniqueSets = _.groupBy(vm.techniques, function(technique){ return technique.techniqueSet });
            var techniqueSets = Object.getOwnPropertyNames(vm.techniqueSets);
            vm.sets = TechniqueService.SortTechniques(techniqueSets);
        }

        function removeWhiteSpace(str){
            return str.replace(/\s+/g, '')+ '-id';

        }

        function removeWhiteSpaceId(str){
            return '#' + str.replace(/\s+/g, '') + '-id';

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
            setTechniquesForDisplay();
        }

        function filterByType(type){
            if(type === vm.filters[1]){
                var gradeTechniques =_.filter(vm.techniques, function(technique){
                    if(GradeService.UserCanSeeAsset(technique.grade.grade, vm.user.grade.grade)){
                        return technique;
                    }
                });
                setTechniquesForDisplay();
            } else if(type === vm.filters[0]){
                var gradeTechniques =_.filter(vm.techniques, function(technique){
                    if(GradeService.UserCanSeeAsset(technique.grade.grade, vm.user.grade.grade)){
                        return technique;
                    }
                });
                vm.techniqueSets = _.groupBy(gradeTechniques, function(technique){ return technique.grade.displayName });
                var grades = Object.getOwnPropertyNames(vm.techniqueSets);
                vm.sets = GradeService.SortGrades(grades);
            }

        }

    }

})();