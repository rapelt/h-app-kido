(function () {
    'use strict';

    angular
        .module('app')
        .controller('Manual.ManualController', Controller);

    function Controller($rootScope, GradeService, UserService, $scope, DocumentService, $stateParams, $sce) {
        var vm = this;

        $scope.pdfUrl = '';

        vm.user = {};

        vm.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


        vm.availableGrades = [];

        initController();

        function initController() {
            UserService.GetCurrent().then(function(user){
                vm.user = user;
                $rootScope.currentUser = user;
            });

            DocumentService.GetById($stateParams.id).then(function(document){
                vm.document = document;
                $scope.pdfUrl =  '/pdf/' + document.filePath + '.pdf';
                $scope.pdfUrl = $sce.trustAsResourceUrl($scope.pdfUrl);
            })

        }
    }

})();