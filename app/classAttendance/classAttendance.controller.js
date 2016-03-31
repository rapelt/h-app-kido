(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClassAttendance.ClassAttendanceController', Controller);

    function Controller($rootScope, $scope, GoogleService, FlashService) {
        var vm = this;

        vm.user = null;
        var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        vm.dates = [];
        var firstTrainingColumn = 0;
        var lastTraingingColumn = 0;
        vm.studentsAttendance = [];
        $scope.tableDataLoaded = false;

        initController();


        function initController() {
            if($rootScope.currentUser == null){
                UserService.GetCurrent().then(function (user) {
                    vm.user = user;
                    $rootScope.currentUser = user;
                });
            } else {
                vm.user = $rootScope.currentUser;
                GoogleService.callScriptFunction("getDataByMonth").then(function(result){
                    firstTrainingColumn = _.findIndex(result[0], findDay);
                    lastTraingingColumn = _.findLastIndex(result[0], findDay);
                    constructDates(result);
                    studentAttendance(result);
                }, function(error){
                    console.log(error);
                });
            }
        }

        function studentAttendance(result){
            //vm.studentAttendance
            //student - name - array of attendance

            _.each(result, function(row){
                var student = {};
                student.attendance = [];
                _.each(row, function(column, index){
                    if(index == 1){
                        student.name = column;
                    }

                    if(index >= firstTrainingColumn && index <= lastTraingingColumn){
                        var attended = {};

                        attended[vm.dates[index - firstTrainingColumn].date] = column;
                        student.attendance.push(attended);
                    }

                });

                if(student.name != null && student.name != "" && student.name != "Name"){
                    vm.studentsAttendance.push(student);
                }
            });
        }

        function findDay(day) {
            return _.find(daysArray, function (dayName) {
                if (day == dayName) {
                    return true;
                }
            });
        }

        function constructDates(result){
            _.each(result[0], function(dateName, index){
                var date = {};
                if(index >= firstTrainingColumn && index <= lastTraingingColumn){
                    date.dayName = dateName;
                    vm.dates.push(date);
                }
            });

            //date number
            _.each(result[1], function(dateName, index){
                if(index >= firstTrainingColumn && index <= lastTraingingColumn){
                    vm.dates[index - firstTrainingColumn].dateNumber = dateName;
                }
            });

            _.each(result[2], function(dateName, index){
                if(index >= firstTrainingColumn && index <= lastTraingingColumn){
                    vm.dates[index - firstTrainingColumn].date = dateName;
                }
            });
        }

    }

})();