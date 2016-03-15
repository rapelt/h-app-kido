(function () {
    'use strict';

    angular
        .module('app')
        .controller('Translations.TranslationsController', Controller);

    function Controller($window, $rootScope, $scope, $state, $sce, TranslationService, FlashService, GradeService, UserService) {
        var vm = this;

        vm.playerVars = {
            autoplay: 0,
            loop: 1,
            modestbranding: 1,
            showinfo: 0,
            enablejsapi: 1,
            rel: 0
        };

        vm.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        vm.removeWhiteSpace = removeWhiteSpace;
        vm.removeWhiteSpaceId = removeWhiteSpaceId;
        vm.playTranslation = playTranslation;
        vm.disable = false;

        vm.filters = ['Grades', 'Translations'];
        vm.user = {};

        vm.url = "";

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
                        translation.loadSound = false;
                        translation.url = $sce.trustAsResourceUrl(translation.url);

                        if(GradeService.UserCanSeeAsset(translation.grade.grade, vm.user.grade.grade)){
                            return translation;
                        }
                    });
                });
            });
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

        $scope.$on('youtube.player.ready', function ($event, player) {
            // play it again
            if(!vm.isMobile) {
                vm.disable = true;
                player.playVideo();
            }
        });

        $scope.$on('youtube.player.ended', function ($event, player) {
            // play it again
            if(!vm.isMobile) {
                vm.url = "";
                vm.disable = false;
            }
        });

    }

})();