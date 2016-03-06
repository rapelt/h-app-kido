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

        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;

                TechniqueService.GetAll().then(function (techniques){
                    vm.techniques =_.filter(techniques, function(technique){
                        if(GradeService.UserCanSeeAsset(technique.grade.grade, vm.user.grade.grade)){
                            return technique;
                        }
                    });
                    vm.techniqueSets = _.groupBy(vm.techniques, function(technique){ return technique.techniqueSet });

                    vm.sets = Object.getOwnPropertyNames(vm.techniqueSets);

                    console.log(vm.sets);

                    console.log(vm.techniqueSets[vm.sets[0]]);
                });
            });
        }

        function removeWhiteSpace(str){
            return str.replace(/\s+/g, '');

        }

        function removeWhiteSpaceId(str){
            return '#' + str.replace(/\s+/g, '');

        }

    }

})();