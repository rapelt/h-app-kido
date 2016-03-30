(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClassAttendance.ClassAttendanceController', Controller);

    function Controller($window, $rootScope, GoogleService, FlashService) {
        var vm = this;

        vm.user = null;

        vm.googleResult = googleResult;


        initController();


        function initController() {
            if($rootScope.currentUser == null){
                UserService.GetCurrent().then(function (user) {
                    vm.user = user;
                    $rootScope.currentUser = user;
                });
            } else {
                vm.user = $rootScope.currentUser;
                GoogleService.callScriptFunction(googleResult, FlashService.Success, "getDataByMonth");
            }
        }

        function googleResult(result){
            console.log(result);
        }

    }

})();