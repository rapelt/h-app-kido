describe("Classes.Controller.Test", function(){
    var $controller;
    var controller;
    var utils;
    var $rootScope;
    var $scope;

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

    beforeEach(module("testUtils"));
    beforeEach(module("app"));

    beforeEach(angular.mock.inject(function(_$controller_, _$rootScope_, UserService, _utils_, $httpBackend){
        //$httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', 'home/index.html').respond({ body: '<html><body>Mock homepage</body></html>'});


        $scope = _$rootScope_.$new();;
        $rootScope = _$rootScope_;
        var userService = UserService;
        utils = _utils_;
        utils.resolvePromise(UserService, 'GetCurrent', user);

        $controller = _$controller_;
        controller = $controller('Account.Classes', { $scope: $scope, $rootScope: $rootScope, UserService: userService });

        $scope.$apply();

    }));

    it('can get an instance of Classes Controller', function(){
        expect(controller).toBeDefined();
    });

    it('rootScope user should be defined', function(){
        expect($rootScope.currentUser).toBeDefined();
        expect($scope.user).toBeDefined();
        expect($rootScope.currentUser.firstName).toBe("Darryl");
    });

    it('classesForTheYear should be 13', function(){
        expect($scope.classesForTheYear).toBe(13);
    });

    it('classesForTheCurrentMonth should be 0', function(){
        expect($scope.classesForTheCurrentMonth).toBe(0);
    });

    it('classesSinceLastGrading should be 6', function(){
        expect($scope.classesSinceLastGrading).toBe(6);
    });



});