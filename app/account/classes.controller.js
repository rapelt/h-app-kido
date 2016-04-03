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
        $scope.classesForTheCurrentMonth = 0;

        $scope.datesAsDates = [];
        var today = new Date();


        initController();

        function initController() {
            // get current user
            if($rootScope.user == null){
                UserService.GetCurrent().then(function (user) {
                    $scope.user = user;
                    $rootScope.currentUser = user;
                    setDatesAsDates();
                    getClassesForTheYear();
                    getClassesForTheMonth();

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

        function setDatesAsDates(){
            _.each($scope.user.attendance, function(dateString){
                var dateObj ={};
                dateObj.date = new Date(dateString);
                dateObj.dateString = dateString
                $scope.datesAsDates.push(dateObj);
            });
        }

        function getClassesForTheMonth(){
            _.each($scope.datesAsDates, function(date){
                if(today.getMonth() === date.date.getMonth()){
                    $scope.classesForTheCurrentMonth++;
                }
            });
        }

    }
})();
