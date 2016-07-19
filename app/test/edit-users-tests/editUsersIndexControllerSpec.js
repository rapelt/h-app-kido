describe("Edit User.Controller.Test", function(){
    var $controller;
    var controller;
    var utils;
    var $rootScope;
    var userService;
    var flashService;
    var gradeService;
    var statsService;
    var $scope;

    var stats = {"0": {
        "_id": "573a5a66e39cc71100b0d987",
        "stat": "translations",
        "time": "5/17/2016, 9:40:22 AM",
        "user": "Sabomnim"}}
    ;

    var user = {
        "_id": {
            "$oid": "56f125b6ddb0d01100f34deb"
        },
        "firstName": "Darryl",
        "lastName": "Cox",
        "username": "dcox",
        "grade": {
            "id": 2,
            "grade": "yellow2",
            "displayName": "Yellow 2"
        },
        "isFirstLogin": false,
        "hash": "$2a$10$YforekNRJvFlVJyLHxOhseiovo20gQ.wt4QhJyP2HfoByCdA/kWgC",
        "isAdmin": null,
        "attendance": [
            "21-Jan-16",
            "28-Jan-16",
            "3-Mar-16",
            "8-Mar-16",
            "10-Mar-16",
            "15-Mar-16",
            "17-Mar-16",
            "22-Mar-16",
            "29-Mar-16",
            "9-Feb-16",
            "11-Feb-16",
            "18-Feb-16",
            "23-Feb-16"
        ],
        "grades": [
            {
                "date": "2016-02-25T00:00:00.000Z",
                "grade": "Yellow 1"
            },
            {
                "date": "2016-03-03T00:00:00.000Z",
                "grade": "Yellow 2"
            }
        ]
    };

    var editedUser = {
        "_id": {
            "$oid": "56f125b6ddb0d01100f34deb"
        },
        "firstName": "Darryl",
        "lastName": "Cox",
        "username": "darrylcox",
        "grade": {
            "id": 2,
            "grade": "yellow2",
            "displayName": "Yellow 2"
        },
        "isFirstLogin": false,
        "hash": "$2a$10$YforekNRJvFlVJyLHxOhseiovo20gQ.wt4QhJyP2HfoByCdA/kWgC",
        "isAdmin": null,
        "attendance": [
            "21-Jan-16",
            "28-Jan-16",
            "3-Mar-16",
            "8-Mar-16",
            "10-Mar-16",
            "15-Mar-16",
            "17-Mar-16",
            "22-Mar-16",
            "29-Mar-16",
            "9-Feb-16",
            "11-Feb-16",
            "18-Feb-16",
            "23-Feb-16"
        ],
        "grades": [
            {
                "date": "2016-02-25T00:00:00.000Z",
                "grade": "Yellow 1"
            },
            {
                "date": "2016-03-03T00:00:00.000Z",
                "grade": "Yellow 2"
            }
        ]
    };

    beforeEach(module("testUtils"));
    beforeEach(module("app"));


    beforeEach(angular.mock.inject(function(_$controller_, _$rootScope_, UserService, _utils_, FlashService, GradeService, StatsService, $httpBackend){
        //$httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', 'home/index.html').respond({ body: '<html><body>Mock homepage</body></html>'});

        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        userService = UserService;
        flashService = FlashService;
        gradeService = GradeService;
        statsService = StatsService;

        utils = _utils_;
        utils.resolvePromise(userService, 'GetCurrent', user);
        utils.resolvePromise(userService, 'GetAll', [user]);
        utils.resolvePromise(statsService, 'GetByUsername', stats);



        $controller = _$controller_;
        controller = $controller('EditUser.IndexController', {$rootScope: $rootScope, UserService: userService, FlashService: flashService, GradeService: gradeService, StatsService: statsService });
        vm = controller;

        $scope.$apply();

    }));

    it('initController can get an instance of EditUser Controller', function(){
        expect(controller).toBeDefined();
    });

    it('initController rootScope user should be defined', function(){
        expect($rootScope.currentUser).toBeDefined();
        expect(vm.user).toBeDefined();
        expect($rootScope.currentUser.firstName).toBe("Darryl");
    });

    it('dismiss should get the saved user and replace the existing one in the array', function(){
        utils.resolvePromise(userService, 'GetById', editedUser);

        controller.editUser(user, 0);
        controller.dismiss(user);

        $scope.$apply();

        expect(controller.allUsers[0].username).toBe("darrylcox");
    });

    it('create should make a new user', function(){
        utils.resolvePromise(gradeService, 'GetCurrent', "yellow1");
        utils.resolvePromise(userService, 'Create');
        controller.userForEdit = user;

        controller.create(user);

        $scope.$apply();

        expect(controller.userForEdit).toBe(null);
    });

    it('create should update an existing user', function(){
        utils.resolvePromise(gradeService, 'GetCurrent', "yellow1");
        utils.resolvePromise(userService, 'Update');
        controller.userForEdit = user;

        controller.editUser(user, 0);
        controller.create(user);

        $scope.$apply();
        
        expect(controller.userForEdit).toBe(null);
    });



});