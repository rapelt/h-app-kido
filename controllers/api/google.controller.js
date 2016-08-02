var express = require('express');
var router = express.Router();
var _ = require('underscore');
var userService = require('services/user.service');


// routes
router.post('/googleClassAttendance', googleClassAttendance);
router.post('/googleGrades', googleGrades);



module.exports = router;

var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var dates = [];
var firstTrainingColumn = 0;
var lastTraingingColumn = 0;
var studentsAttendance = [];


function googleClassAttendance(req, res) {
    firstTrainingColumn = 0;
    lastTraingingColumn = 0;
    studentsAttendance = [];

    var googleResult = req.body;
    console.log(Date.now(), googleResult[googleResult.length-1]);
    getSheetData(googleResult[0]);
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













//Grades

var grades = [
    {"id": 0, "grade": "white", "displayName": "White"},
    {"id": 1, "grade": "yellow1", "displayName": "Yellow 1"},
    {"id": 2, "grade": "yellow2", "displayName": "Yellow 2"},
    {"id": 3, "grade": "yellow3", "displayName": "Yellow 3"},
    {"id": 4, "grade": "blue1", "displayName": "Blue 1"},
    {"id": 5, "grade": "blue2", "displayName": "Blue 2"},
    {"id": 6, "grade": "blue3", "displayName": "Blue 3"},
    {"id": 7, "grade": "red1", "displayName": "Red 1"},
    {"id": 8, "grade": "red2", "displayName": "Red 2"},
    {"id": 9, "grade": "red3", "displayName": "Red 3"},
    {"id": 10, "grade": "black", "displayName": "Black"}
];
var gradesNames = [];
var studentGrades = [];

function googleGrades(req, res){
    var googleResult = req.body;
    getAllUsersGrades(null, null, googleResult);

    res.sendStatus(200);
}

function getAllUsersGrades(req, res, data) {
    userService.getAll()
        .then(function (users) {
            if (users) {
                populateUsersGrades(users, data)
            }
        }).catch(function (err) {
        console.log("No Users", err);
    });
}


function populateUsersGrades(users, data){
    studentGrades = [];
    gradesNames = [];
    setUpDataBasedOnGoogleResults(data);
    _.each(users, function(user){
        var studentGrade = _.find(studentGrades, function(student){
            if(student.name.trim() == (user.firstName + " " + user.lastName)){
                return true;
            }
        });

        if(studentGrade != null){
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

            if(user.feedback === undefined){
                if(studentGrade.feedback != null){
                    var userFeedback = { "comment": studentGrade.feedback, "date": studentGrade.feedbackDate};
                    user.feedback = [userFeedback];
                }
            } else {
                var feedbackExists = _.find(user.feedback, function (userFeedback) {
                    if(userFeedback.date === user.feedbackDate){
                        return true;
                    }
                });

                if (feedbackExists === undefined){
                    if(studentGrade.feedback != undefined){
                        console.log(user.feedback);
                        var newFeedBack = [];
                        var userFeedback = { "comment": studentGrade.feedback, "date": studentGrade.feedbackDate};
                        newFeedBack.push(userFeedback);
                        user.feedback = newFeedBack;
                    }
                }
            }

            user.grade = UpdateUserGrade(user);

            userService.update(user._id, user).then(function () {
                console.log("Student Updates", user.firstName + " " + user.lastName + " With: " + user.feedback);
            });
        }
    });

}



function setUpDataBasedOnGoogleResults(results){
    _.each(results[0], function(grades, $index){
        if($index != 0){
            gradesNames.push(grades);
        }
    });

    _.each(results, function(row){
        var student = {};
        student.grades = [];
        _.each(row, function(column, index){
            if(index == 0){
                student.name = column;
            } else if(index == 15){
                student.feedback = column;
            } else if(index == 16){
                student.feedbackDate = column;
            } else {
                var grade = {};
                var date = sheetDateToDate(column);
                grade.date = column != "" ? date.toLocaleString() : "";
                grade.grade = gradesNames[index-1];
                student.grades.push(grade);
            }
        });

        if(student.name != null && student.name != "" && student.name != "Name"){
            studentGrades.push(student);
        }
    });
}

function sheetDateToDate(sheetDate){
    var daysSinceUnixTime = sheetDate - 25569;
    var millisSinceUnixTime = daysSinceUnixTime * 24 * 60 * 60 * 1000;
    var date = new Date(millisSinceUnixTime);
    return date;
}


function UpdateUserGrade(user){
    user.grades.sort(function(a, b){
        var indexOfa =  _.indexOf(grades, GetCurrentByDisplayName(a.grade));
        var indexOfb =  _.indexOf(grades, GetCurrentByDisplayName(b.grade));
        return indexOfa - indexOfb;
    });

    var grade =  GetCurrentByDisplayName(user.grades[user.grades.length -1].grade);

    return grade;
}

function GetCurrentByDisplayName(gradestr) {
    if(gradestr === "4th Dan" || gradestr === "3rd Dan" || gradestr === "2nd Dan" || gradestr === "1st Dan"){
        gradestr = "Black";
    }
    return _.find(grades, function(grade){ return grade.displayName == gradestr  });
}


