var express = require('express');
var router = express.Router();
var _ = require('underscore');

// routes
router.post('/googleClassAttendance', googleClassAttendance);

module.exports = router;

var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var dates = [];
var firstTrainingColumn = 0;
var lastTraingingColumn = 0;

function googleClassAttendance(req, res) {
    var stuff = req.body;
    getSheetData(stuff[0]);
    console.log(dates);

    res.sendStatus(200);
}

function getSheetData(result){
        dates = [];
        firstTrainingColumn = _.findIndex(result[0], findDay);
        lastTraingingColumn = _.findLastIndex(result[0], findDay);
        constructDates(result);
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