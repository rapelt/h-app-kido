(function () {
    'use strict';

    angular
        .module('app')
        .controller('Feedback.FeedbackController', Controller);

    function Controller($rootScope, UserService) {
        var vm = this;

        vm.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        vm.user = {};

        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                $rootScope.currentUser = user;
            });
        }
    }

})();