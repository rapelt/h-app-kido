(function () {
    'use strict';

    angular
        .module('app')
        .controller('Technique.TechniqueController', Controller);

    function Controller($stateParams, $rootScope, UserService, TechniqueService) {
        var vm = this;
        vm.user = {};
        vm.technique = {};
        vm.index = $stateParams.index;
        vm.techniqueSet = $stateParams.techniquesSet;
        vm.previousDisabled = true;
        vm.nextDisabled = true;


        vm.playerVars = {
            autoplay: 1,
            loop: 1,
            modestbranding: 1,
            showinfo: 0,
            enablejsapi: 1,
            rel: 0
        };

        initController();

        function initController() {
            if(vm.index != null){
                UserService.GetCurrent().then(function(user){
                    vm.user = user;
                    $rootScope.currentUser = user;
                });

                TechniqueService.GetById($stateParams.id).then(function(technique){
                    vm.technique = technique;
                    if(vm.index > 0){
                        vm.previousDisabled = false;
                    }

                    if(vm.index < vm.techniqueSet.length-1){
                        vm.nextDisabled = false;
                    }
                });
            }
        }
    }

})();