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
        vm.filteredBy = vm.filters[0];
        vm.user = {};

        vm.techniques = []

        vm.techniqueSets = [];

        vm.sets = [];

        vm.availableGrades = [];
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
                            return technique;
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
            sortSets();
            filterByType(vm.filteredBy);
        }

        function removeWhiteSpace(str){
            return str.replace(/\s+/g, '')+ '-id';

        }

        function removeWhiteSpaceId(str){
            return '#' + str.replace(/\s+/g, '') + '-id';

        }

        function filterByType(type){
            if(type === vm.filters[1]){
                //technique
                var gradeTechniques =_.filter(vm.techniques, function(technique){
                    if(GradeService.UserCanSeeAsset(technique.grade.grade, vm.user.grade.grade)){
                        return technique;
                    }
                });
                setTechniquesForDisplay();
            } else if(type === vm.filters[0]){
                //grade
                var gradeTechniques =_.filter(vm.techniques, function(technique){
                    if(GradeService.UserCanSeeAsset(technique.grade.grade, vm.user.grade.grade)){
                        return technique;
                    }
                });
                vm.techniqueSets = _.groupBy(gradeTechniques, function(technique){ return technique.grade.displayName });
                var grades = Object.getOwnPropertyNames(vm.techniqueSets);
                vm.sets = GradeService.SortGrades(grades);
                sortAlphabetically();
            }

        }

        function sortAlphabetically(){
            _.each(vm.techniqueSets, function(sets){
                sets.sort(function(a, b) {
                    if (a.techniqueName < b.techniqueName) return -1;
                    if (a.techniqueName > b.techniqueName) return 1;
                    return 0;
                });
            });
        }

        function sortSets(){
            _.each(vm.techniqueSets, function(sets){
                var lastIndexOfA = sets[0].techniqueName.lastIndexOf(" ");
                var aString = sets[0].techniqueName.substring(lastIndexOfA, sets[0].techniqueName.length);
                var aInt = parseInt(aString);
                if(isNaN(aInt)){
                    GradeService.SortTechniquesByGrades(sets);
                } else {
                    sets.sort(function(a, b){
                        var lastIndexOfA = a.techniqueName.lastIndexOf(" ");
                        var aString = a.techniqueName.substring(lastIndexOfA, a.techniqueName.length);
                        var aInt = parseInt(aString);

                        var lastIndexOfB = b.techniqueName.lastIndexOf(" ");
                        var bString = b.techniqueName.substring(lastIndexOfB, b.techniqueName.length);
                        var bInt = parseInt(bString);

                        return aInt - bInt;
                    });
                }

            });
        }

    }

})();