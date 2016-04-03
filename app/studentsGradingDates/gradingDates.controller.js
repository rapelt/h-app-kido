(function () {
    'use strict';

    angular
        .module('app')
        .controller('GradingDates.GradingDatesController', Controller);

    function Controller($window, $rootScope, $scope, GoogleService, FlashService, UserService) {
        var vm = this;

        vm.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        vm.user = null;

        vm.grades = [];

        vm.studentsGrades = [];

        var firstTrainingColumn = 0;
        var lastTraingingColumn = 0;

        initController();

        $window.checkAuth = function() {
            if($rootScope.currentUser == null){
                UserService.GetCurrent().then(function (user) {
                    $rootScope.currentUser = user;
                    googleServiceCall()

                });
            } else {
                angular.element(document).ready(function () {
                    googleServiceCall()
                });
            }
        };

        window.checkAuth();

        function googleServiceCall(){
            if(vm.user.isAdmin && !$rootScope.googleHasBeenAuthenticated){
                GoogleService.checkAuth().then(function(result){
                    googleStuff()
                }, function(error){
                    GoogleService.checkAuthImmidiateFalse().then(function(result){
                        googleStuff()
                    }, function(error){
                        googleStuff()
                    });
                });
            }
        }

        function initController() {
            if($rootScope.currentUser == null){
                UserService.GetCurrent().then(function (user) {
                    vm.user = user;
                    $rootScope.currentUser = user;
                });
            } else {
                vm.user = $rootScope.currentUser;
            }
        }

        function googleStuff(){
            if($rootScope.googleHasBeenAuthenticated){
                GoogleService.callScriptFunction("getGradingsData").then(function(result){
                    setUpDataBasedOnGoogleResults(result);
                    UserService.GetAll().then(function(users){
                        populateUsersGrades(users)
                    });
                }, function(error){
                    FlashService.Error(error);
                });
            }else if($rootScope.googleHasBeenAuthenticated === false && tries != 1){
                console.log("Attemp Auth 2");
                tries = 1;
                googleServiceCall();
            }
        }

        function populateUsersGrades(users){
            _.each(users, function(user){
                var studentGrade = _.find(vm.studentsGrades, function(student){
                    if(student.name.trim() == (user.firstName + " " + user.lastName)){
                        return true;
                    }
                });

                if(studentGrade != null){
                    //user.attendance = [];
                    _.each(studentGrade.grades, function(grade){
                        if(grade.date != ""){
                            var userGrade = _.find(user.grades, function(userGrade){
                                if(grade.grade == userGrade.grade){
                                    return true;
                                }
                            });
                            if(userGrade == null){
                                if(user.grades == undefined){
                                    user.grades = [];
                                }
                                user.grades.push(grade);
                            }
                        }
                    });

                    UserService.Update(user);
                }
            });

        }

        function setUpDataBasedOnGoogleResults(results){
            _.each(results[0], function(grades, $index){
                if($index != 0){
                    vm.grades.push(grades);
                }
            });

            _.each(results, function(row){
                var student = {};
                student.grades = [];
                _.each(row, function(column, index){
                    if(index == 0){
                        student.name = column;
                    } else {
                        var grade = {};
                        grade.date = column != "" ? sheetDateToDate(column) : "";
                        grade.grade = vm.grades[index-1];
                        student.grades.push(grade);
                    }

                });


                if(student.name != null && student.name != "" && student.name != "Name"){
                    vm.studentsGrades.push(student);
                }
            });
        }

        function sheetDateToDate(sheetDate){
            var daysSinceUnixTime = sheetDate - 25569;
            var millisSinceUnixTime = daysSinceUnixTime * 24 * 60 * 60 * 1000;
            return new Date(millisSinceUnixTime);
        }


    }

})();