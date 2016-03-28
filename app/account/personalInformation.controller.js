(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.PersonalInformation', Controller)
        .directive('personalInformation', function (){
            return {
                templateUrl: 'account/personalInformation.html'
            }

        });

    function Controller($scope, $rootScope, UserService, FlashService) {
        $scope.user = null;
        $scope.saveUser = saveUser;
        $scope.confirmPassword = "";

        initController();

        function initController() {
            // get current user
            if($rootScope.user == null){
                UserService.GetCurrent().then(function (user) {
                    $scope.user = user;
                    $rootScope.currentUser = user;
                });
            } else {
                $scope.user = $rootScope.user;
            }

        }

        function saveUser() {
            if($scope.user.password === $scope.confirmPassword) {
                if($scope.user.password == undefined){
                    FlashService.Error("Please enter a password");
                } else {
                UserService.Update($scope.user)
                    .then(function () {
                        FlashService.Success('User updated');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
                }
            } else {
                FlashService.Error("The new password does not match the confirmation password");
            }

        }

    }
})();
