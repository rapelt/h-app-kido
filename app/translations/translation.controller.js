(function () {
    'use strict';

    angular
        .module('app')
        .controller('Translation.TranslationController', Controller);

    function Controller($stateParams, $rootScope, UserService, TranslationService) {
        var vm = this;
        vm.user = {};
        vm.translation = {};

        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                $rootScope.currentUser = user;
            })

            TranslationService.GetById($stateParams.id).then(function(translation){
                vm.translation = translation;
            })

        }
    }

})();