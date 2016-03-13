(function () {
    'use strict';

    angular
        .module('app')
        .controller('Technique.TechniqueController', Controller);

    function Controller($stateParams, $rootScope, UserService, TechniqueService) {
        var vm = this;
        vm.user = {};
        vm.technique = {};

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
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                $rootScope.currentUser = user;
            })

            TechniqueService.GetById($stateParams.id).then(function(technique){
                vm.technique = technique;
            })

        }
    }

})();