(function () {
    'use strict';

    angular
        .module('app')
        .controller('Translations.TranslationsController', Controller);


    function Controller($window, $rootScope, $scope, $state, $sce, TranslationService, FlashService, GradeService, UserService) {
        var vm = this;

        vm.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        vm.removeWhiteSpace = removeWhiteSpace;
        vm.removeWhiteSpaceId = removeWhiteSpaceId;
        vm.playTranslation = playTranslation;
        vm.filterByType = filterByType;
        vm.disable = false;
        vm.trustedUrl = trustedUrl;

        vm.filters = [];
        vm.user = {};

        
        vm.url = "";

        vm.translationSets = [];

        vm.translations = [];
        vm.filteredTranslations = [];

        vm.availableGrades = [];

        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                $rootScope.currentUser = user;
                vm.availableGrades = GradeService.GetAvaliableGrades(vm.user.grade.grade);
                vm.availableGrades.unshift({grade: "all", displayName: "All"});
                TranslationService.GetAll().then(function (translations){
                    vm.translationSets = _.groupBy(translations, function(translation){ return translation.group });
                    vm.filters = Object.getOwnPropertyNames(vm.translationSets);
                    vm.filters.push("All");

                    vm.translations =_.filter(translations, function(translation){
                        translation.loadSound = false;
                        if(translation.url != undefined && translation.url.length > 200){
                            translation.url = translation.url.substring(71, translation.url.length);
                            translation.url = translation.url.substring(0, translation.url.length -  136);
                            translation.url = translation.url + "&amp;color=ff5500&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false"
                        }

                        if(GradeService.UserCanSeeAsset(translation.grade.grade, vm.user.grade.grade) && (translation.url != undefined && translation.url.length > 200)){
                            return translation;
                        }
                    });
                    vm.filteredTranslations = vm.translations;
                });
            });
        }

        function trustedUrl(url)
        {
            return $sce.trustAsResourceUrl(url);
        }

        function playTranslation(translation){
            translation.loadSound = true;
        }

        function removeWhiteSpace(str){
            return str.replace(/\s+/g, '')+ '-id';

        }

        function removeWhiteSpaceId(str){
            return '#' + str.replace(/\s+/g, '') + '-id';

        }

        function filterByType(type){
            vm.filteredTranslations = vm.translationSets[type];

            if(type === "All"){
                vm.filteredTranslations = vm.translations;
            }
        }
    }

})();