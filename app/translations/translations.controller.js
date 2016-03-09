(function () {
    'use strict';

    angular
        .module('app')
        .controller('Translations.TranslationsController', Controller);

    function Controller($window, $rootScope, $state, TranslationService, FlashService, GradeService, UserService) {
        var vm = this;

        vm.removeWhiteSpace = removeWhiteSpace;
        vm.removeWhiteSpaceId = removeWhiteSpaceId;

        vm.filters = ['Grades', 'Translations'];
        vm.user = {};

        vm.translations = []

        vm.availableGrades = [];

        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                $rootScope.currentUser = user;
                vm.availableGrades = GradeService.GetAvaliableGrades(vm.user.grade.grade);
                vm.availableGrades.unshift({grade: "all", displayName: "All"});
                TranslationService.GetAll().then(function (translations){
                    vm.translations =_.filter(translations, function(translation){
                        if(GradeService.UserCanSeeAsset(translation.grade.grade, vm.user.grade.grade)){
                            return translation;
                        }
                    });
                });
            });
        }

        function removeWhiteSpace(str){
            return str.replace(/\s+/g, '')+ '-id';

        }

        function removeWhiteSpaceId(str){
            return '#' + str.replace(/\s+/g, '') + '-id';

        }

    }

})();