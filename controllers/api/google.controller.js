var express = require('express');
var router = express.Router();
var _ = require('underscore');
var userService = require('services/user.service');


// routes
router.post('/googleClassAttendance', googleClassAttendance);

module.exports = router;

var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var dates = [];
var firstTrainingColumn = 0;
var lastTraingingColumn = 0;
var studentsAttendance = [];


function googleClassAttendance(req, res) {
    var stuff = req.body;
    getSheetData(stuff[0]);
    res.sendStatus(200);
}

function getSheetData(result){
        dates = [];
        firstTrainingColumn = _.findIndex(result[0], findDay);
        lastTraingingColumn = _.findLastIndex(result[0], findDay);
        constructDates(result);
        getAllUsers(null, null, result);
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
            dates.push(date);
        }
    });

    //date number
    _.each(result[1], function(dateName, index){
        if(index >= firstTrainingColumn && index <= lastTraingingColumn){
            dates[index - firstTrainingColumn].dateNumber = dateName;
        }
    });

    _.each(result[2], function(dateName, index){
        if(index >= firstTrainingColumn && index <= lastTraingingColumn){
            dates[index - firstTrainingColumn].date = dateName;
        }
    });
}

function getAllUsers(req, res, data) {
    userService.getAll()
        .then(function (users) {
            if (users) {
                populateUsersAttendance(users, data)
            }
        }).catch(function (err) {
            console.log("No Users");
        });
}

function populateUsersAttendance(users, data){
    populateStudentAttendance(data);
    _.each(users, function(user){
        var studentAttendance = _.find(studentsAttendance, function(student){
            if(student.name.trim() == (user.firstName + " " + user.lastName)){
                return true;
            }
        });

        if(studentAttendance != null){
            _.each(studentAttendance.attendance, function(attended){
                if(attended.didAttend == 1){
                    var attend = _.find(user.attendance, function(userAttened){
                        if(userAttened == attended.date.trim()){
                            return true;
                        }
                    });

                    console.log(attended);
                    if(attend == null){
                        if(user.attendance == undefined){
                            user.attendance = [];
                        }
                        user.attendance.push(attended.date);
                    }
                }
            });

            userService.update(user._id, user).then(function () {
                console.log("Student Updates", user.firstName + " With: " + user.attendance);
            });
        }
    });

}

function populateStudentAttendance(result){
    _.each(result, function(row){
        var student = {};
        student.attendance = [];
        _.each(row, function(column, index){
            if(index == 1){
                student.name = column;
            }

            if(index >= firstTrainingColumn && index <= lastTraingingColumn){
                var attended = {};
                attended.date = dates[index - firstTrainingColumn].date;
                attended.didAttend = column;
                student.attendance.push(attended);
            }

        });

        if(student.name != null && student.name != "" && student.name != "Name"){
            studentsAttendance.push(student);
        }
    });
}

