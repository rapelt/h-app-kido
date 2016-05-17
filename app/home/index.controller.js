(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($rootScope, UserService, FlashService, StatsService) {
        var vm = this;

        vm.user = null;
        vm.newPassword = newPassword;
        vm.confirmPassword = "";
        vm.isFL = false;

        initController();

        function initController() {
            // get current user
            if($rootScope.currentUser == null){
                UserService.GetCurrent().then(function (user) {
                    $rootScope.currentUser = user;
                    afterInit(user);

                });
            } else {
                afterInit($rootScope.currentUser);
            }

        }

        function afterInit(user) {
            vm.user = user;
            vm.isFL = vm.user.isFirstLogin;
            if (user.isFirstLogin) {
                $('#myModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#myModal').modal('show')
            } else {
                $('#myModal').modal('hide')

            }
        }

        function newPassword(){
            if(vm.user.password === vm.confirmPassword) {
                $('#myModal').modal('hide')
                vm.user.isFirstLogin = false;
                UserService.Update(vm.user)
                    .then(function () {
                        FlashService.Success('Password updated');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                FlashService.Error("The new password does not match the confirmation password");
            }

        }

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if(toState != undefined) {
                $rootScope.activeTab = toState.data.activeTab;

                if(toState.name === "technique"){
                    if(toParams.index == null){
                        $state.go('techniques');
                    }
                }
            }

            /*var stat = { };
            if(toParams.id != undefined){
                stat.id = toParams.id;
            }
            if($rootScope.currentUser != null){
                stat.user = $rootScope.currentUser.username;
                saveStat();
            } else {
                UserService.GetCurrent().then(function(user){
                    stat.user = user.username;
                    $rootScope.currentUser = user;
                    saveStat();
                });
            }

            function saveStat(){
                if(stat.user != "admin"){
                    stat.stat=  toState.name;
                    stat.time = (new Date()).toLocaleString();
                    StatsService.Create(stat);
                }

            }*/

        });

    }

})();