describe("Grade.Service.Test", function(){
    var gradeService;

    beforeEach(module("app"));

    beforeEach(inject(function(GradeService){
        gradeService = GradeService;
    }));

    var user = {
        "_id": {
            "$oid": "57083bb40f36111100543784"
        },
        "firstName": "Ben",
        "lastName": "Langford",
        "username": "blangford",
        "grade": {
            "id": 5,
            "grade": "blue2",
            "displayName": "Blue 2"
        },
        "isFirstLogin": true,
        "hash": "$2a$10$eipL/gY7eIq/gR1YrqBFqeQK0/Py8tOqsqHyuMjh9r2zFXECsgNTy",
        "isAdmin": null,
        "attendance": null,
        "grades": [
            {
                "date": "4/12/2015, 12:00:00 AM",
                "grade": "Yellow 1"
            },
            {
                "date": "4/12/2015, 12:00:00 AM",
                "grade": "Yellow 2"
            },
            {
                "date": "9/24/2015, 12:00:00 AM",
                "grade": "Yellow 3"
            },
            {
                "date": "9/24/2015, 12:00:00 AM",
                "grade": "Blue 1"
            },
            {
                "date": "3/31/2016, 12:00:00 AM",
                "grade": "Blue 2"
            }
        ]
    };

    it('can get an instance of grade service', function(){
        expect(gradeService).toBeDefined();
    });

    it('should return a grade object that matches the grade string', function() {
        var yellow1 = gradeService.GetCurrent('yellow1');
        var yellow1Obj = {"id": 1, "grade": "yellow1", "displayName": "Yellow 1"};
        expect(yellow1).toEqual(yellow1Obj);
    });

    it('GetCurrent should return a grade display name that matches the grade string', function() {
        var yellow1 = gradeService.GetCurrentByDisplayName('Yellow 1');
        var yellow1Obj = {"id": 1, "grade": "yellow1", "displayName": "Yellow 1"};
        expect(yellow1).toEqual(yellow1Obj);
    });

    it('GetCurrentByDisplayName should return a Black when 4thDan', function() {
        var dan4 = gradeService.GetCurrentByDisplayName('4th Dan');
        var dan3 = gradeService.GetCurrentByDisplayName('3rd Dan');
        var dan2 = gradeService.GetCurrentByDisplayName('2nd Dan');
        var dan1 = gradeService.GetCurrentByDisplayName('1st Dan');

        var black = {"id": 10, "grade": "black", "displayName": "Black"};
        expect(dan4).toEqual(black);
        expect(dan3).toEqual(black);
        expect(dan2).toEqual(black);
        expect(dan1).toEqual(black);
    });

    it('AddGrade should add one belt grade to the current grade', function() {
        var yellow1 = gradeService.AddGrade('yellow1');
        var yellow1Obj = {"id": 2, "grade": "yellow2", "displayName": "Yellow 2"};
        expect(yellow1).toEqual(yellow1Obj);
    });

    it('AddGrade should return black when adding to black', function() {
        var currentBlack = gradeService.AddGrade('black');
        var black = {"id": 10, "grade": "black", "displayName": "Black"}
        expect(currentBlack).toEqual(black);
    });


    it('SubtractGrade should minus one belt grade from the current grade', function() {
        var yellow1 = gradeService.SubtractGrade('yellow1');
        var white = {"id": 0, "grade": "white", "displayName": "White"};
        expect(yellow1).toEqual(white);
    });

    it('SubtractGrade should return white when substracting from white', function() {
        var currentWhite = gradeService.SubtractGrade('white');
        var white = {"id": 0, "grade": "white", "displayName": "White"};
        expect(currentWhite).toEqual(white);
    });

    it('UserCanSeeAsset should return true when user grade is higher then assets grade', function() {
        var technique = "white";
        var user = "yellow1";
        var canSeeAsset = gradeService.UserCanSeeAsset(technique, user);
        expect(canSeeAsset).toBeTruthy();
    });

    it('UserCanSeeAsset should return false when user grade is lower then assets grade', function() {
        var technique = "black";
        var user = "yellow1";
        var canSeeAsset = gradeService.UserCanSeeAsset(technique, user);
        expect(canSeeAsset).toBeFalsy();
    });

    it('GetAvaliableGrades should return an array of the avaliable grade', function() {
        var user = "blue2";
        var avaliableGrades = [{"id": 0, "grade": "white", "displayName": "White"},
            {"id": 1, "grade": "yellow1", "displayName": "Yellow 1"},
            {"id": 2, "grade": "yellow2", "displayName": "Yellow 2"},
            {"id": 3, "grade": "yellow3", "displayName": "Yellow 3"},
            {"id": 4, "grade": "blue1", "displayName": "Blue 1"},
            {"id": 5, "grade": "blue2", "displayName": "Blue 2"},
            {"id": 6, "grade": "blue3", "displayName": "Blue 3"}];
        var canSeeAsset = gradeService.GetAvaliableGrades(user);
        expect(canSeeAsset).toEqual(avaliableGrades);
    });

    it('SortGrades should return an array of grades in order', function() {
        var unsortedGrades = ["Red 3", "Black", "Red 1", "Red 2", "White", "Yellow 1", "Yellow 2", "Yellow 3", "Blue 2", "Blue 1", "Blue 3"];
        var sortedGrades = gradeService.SortGrades(unsortedGrades);
        var gradesInOrder = ["White", "Yellow 1", "Yellow 2", "Yellow 3", "Blue 1", "Blue 2", "Blue 3", "Red 1", "Red 2", "Red 3", "Black"];
        expect(sortedGrades).toEqual(gradesInOrder);
    });

    it('SortTechniquesByGrades should return an array of techniques in order', function() {
        var unsortedTechniques = [
            {grade: {"id": 3, "grade": "yellow3", "displayName": "Yellow 3"}},
            {grade: {"id": 5, "grade": "blue2", "displayName": "Blue 2"}},
            {grade: {"id": 1, "grade": "yellow1", "displayName": "Yellow 1"}}
        ];

        var sortTechniques = gradeService.SortTechniquesByGrades(unsortedTechniques);
        var sortedTechniques = [
            {grade: {"id": 1, "grade": "yellow1", "displayName": "Yellow 1"}},
            {grade: {"id": 3, "grade": "yellow3", "displayName": "Yellow 3"}},
            {grade: {"id": 5, "grade": "blue2", "displayName": "Blue 2"}}
        ];
        expect(sortTechniques).toEqual(sortedTechniques);
    });

    it('UpdateUserGrade should return the current grade of the user', function() {
        var usersGrade = gradeService.UpdateUserGrade(user);
        var expectedGrade = {"id": 5, "grade": "blue2", "displayName": "Blue 2"};
        expect(usersGrade).toEqual(expectedGrade);
    });
});