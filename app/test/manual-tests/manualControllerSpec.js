describe("Documents Index.Controller.Test", function(){
    var $controller;
    var controller;
    var utils;
    var $rootScope;
    var $scope;
    var vm = null;
    var userService;
    var flashService;
    var gradeService;
    var documentService;
    var window;

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

    var documents = {"0" : {
        "_id": {
            "$oid": "56e4d85c6f075d0a1d187f4c"
        },
        "filePath": "CombinationKicking",
        "fileName": "Combination Kicking",
        "rotation": "0",
        "grade": {
            "id": 0,
            "grade": "white",
            "displayName": "White"
        }
    }};

    var editedDocument = {
        "_id": {
            "$oid": "56e4d85c6f075d0a1d187f4c"
        },
        "filePath": "CombinationKicking",
        "fileName": "Combination Kicking Edited",
        "rotation": "0",
        "grade": {
            "id": 0,
            "grade": "white",
            "displayName": "White"
        }
    };

    beforeEach(module("testUtils"));
    beforeEach(module("app"));


    beforeEach(angular.mock.inject(function(_$controller_, _$rootScope_, UserService, _utils_, $httpBackend, FlashService, $window, GradeService, DocumentService){
        //$httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', 'home/index.html').respond({ body: '<html><body>Mock homepage</body></html>'});

        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        userService = UserService;
        flashService = FlashService;
        gradeService = GradeService;
        documentService = DocumentService;
        window = $window;

        utils = _utils_;

        utils.resolvePromise(UserService, 'GetCurrent', user);

        utils.resolvePromise(DocumentService, 'GetAll', documents);

        $controller = _$controller_;
        controller = $controller('Documents.IndexController', { DocumentService: documentService, FlashService: flashService, GradeService: gradeService, UserService: userService });
        vm = controller;

        $scope.$apply();

    }));

    it('initController can get an instance of Manual Controller', function(){
        expect(controller).toBeDefined();
    });

    it('initController should populate all the documents and get the current user', function(){
        expect(vm.user).toBeDefined();
        expect(vm.documents).toBeDefined();
    });

    it('dismiss should save changes to the documents metadata', function(){
        utils.resolvePromise(documentService, 'GetById', editedDocument);

        controller.editDocument(documents[0], 0);
        controller.dismiss(documents[0])

        $scope.$apply();

        expect(controller.documents[0].fileName).toBe("Combination Kicking Edited");

    });

});