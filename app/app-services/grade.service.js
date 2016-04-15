(function () {
    'use strict';

    angular
        .module('app')
        .factory('GradeService', Service);

    function Service() {
        var service = {};

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

        service.GetCurrent = GetCurrent;
        service.SubtractGrade = SubtractGrade;
        service.AddGrade = AddGrade;
        service.GetCurrentByDisplayName = GetCurrentByDisplayName;
        service.UserCanSeeAsset = UserCanSeeAsset;
        service.GetAvaliableGrades = GetAvaliableGrades;
        service.SortGrades = SortGrades;
        service.SortTechniquesByGrades = SortTechniquesByGrades;
        service.UpdateUserGrade = UpdateUserGrade;


        return service;

        function GetCurrent(gradestr) {
            return _.find(grades, function(grade){ return grade.grade == gradestr  });
        }

        function GetCurrentByDisplayName(gradestr) {
            if(gradestr === "4th Dan" || gradestr === "3rd Dan" || gradestr === "2nd Dan" || gradestr === "1st Dan"){
                gradestr = "Black";
            }
            return _.find(grades, function(grade){ return grade.displayName == gradestr  });
        }

        function AddGrade(gradestr) {
            var indexOfGrade =  _.indexOf(grades, GetCurrent(gradestr));
            return grades[indexOfGrade < grades.length - 1 ? indexOfGrade + 1 : indexOfGrade];
        }

        function SubtractGrade(gradestr) {
            var indexOfGrade =  _.indexOf(grades, GetCurrent(gradestr));
            return grades[indexOfGrade > 0 ? indexOfGrade - 1 : indexOfGrade];
        }

        function UserCanSeeAsset(technique, user){
            var indexOfTechnique =  _.indexOf(grades, GetCurrent(technique));
            var indexOfUser =  _.indexOf(grades, GetCurrent(user));

            if(indexOfTechnique <= indexOfUser+1){
                return true;
            }
            return false;
        }

        function GetAvaliableGrades(userGrade){
            var indexOfUser =  _.indexOf(grades, GetCurrent(userGrade));
            return grades.slice(0, indexOfUser + 2);
        }

        function SortGrades(gradesArray){
            gradesArray.sort(function(a, b){
                var indexOfa =  _.indexOf(grades, GetCurrentByDisplayName(a));
                var indexOfb =  _.indexOf(grades, GetCurrentByDisplayName(b));
                return indexOfa - indexOfb;
            })
            return gradesArray;
        }

        function SortTechniquesByGrades(gradesArray){
            gradesArray.sort(function(a, b){
                var indexOfa =  _.indexOf(grades, GetCurrentByDisplayName(a.grade.displayName));
                var indexOfb =  _.indexOf(grades, GetCurrentByDisplayName(b.grade.displayName));
                return indexOfa - indexOfb;
            });
            return gradesArray;
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
    }

})();
