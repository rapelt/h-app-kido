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
        $scope.classesSinceLastGrading = 0;


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
                    getClassesSinceLastGrading();
                });
            } else {
                $scope.user = $rootScope.user;
                setDatesAsDates();
                getClassesForTheYear();
                getClassesForTheMonth();
                getClassesSinceLastGrading();
            }

        }

        function getClassesSinceLastGrading(){
            if($scope.user.attendance != null){
                if($scope.user.grade.grade == "white"){
                    $scope.classesSinceLastGrading = $scope.user.attendance.length;
                    return;
                }
                var attendedDates = [];
                _.each($scope.user.attendance, function(attended){
                   attendedDates.push(new Date(attended));
                });

                var gradingDates = [];

                _.each($scope.user.grades, function(graded){
                    gradingDates.push(new Date(graded.date));
                });

                attendedDates.sort(sortDatesAsc);
                gradingDates.sort(sortDatesAsc);

                $scope.classesSinceLastGrading = _.filter(attendedDates, function(attended){
                    if(attended > gradingDates[gradingDates.length-1]){
                        return true;
                    }
                });

                $scope.classesSinceLastGrading = $scope.classesSinceLastGrading.length;

                if(gradingDates[gradingDates.length-1] < new Date("1/1/2016")){
                    $scope.classesSinceLastGrading = ">" + $scope.classesSinceLastGrading
                }

            } else {
                $scope.classesSinceLastGrading = 0;
            }
        }

        var sortDatesAsc = function(date1, date2){
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
            return 0;
        };

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
