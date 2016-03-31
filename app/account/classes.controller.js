(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.Classes', Controller)
        .directive('classes', function (){
            return {
                templateUrl: 'account/classes.html'
            }

        });

    function Controller($scope, $rootScope, UserService) {
        $scope.user = null;
        $scope.classesForTheYear = 0;

        initController();

        function initController() {
            // get current user
            if($rootScope.user == null){
                UserService.GetCurrent().then(function (user) {
                    $scope.user = user;
                    $rootScope.currentUser = user;
                    getClassesForTheYear();
                });
            } else {
                $scope.user = $rootScope.user;
                getClassesForTheYear();
            }

        }

        function getClassesForTheYear(){
            if($scope.user.attendance != null){
                $scope.classesForTheYear = $scope.user.attendance.length;
            } else {
                $scope.classesForTheYear = 0;
            }
        }

    }
})();
