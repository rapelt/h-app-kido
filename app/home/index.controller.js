﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($rootScope, $window, UserService, YoutubeService) {
        var vm = this;

        vm.user = null;
        $rootScope.currentUser = null;;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.currentUser = user
            });
        }

        $window.initGapi = function() {
            YoutubeService.initGapi();
        }
    }

})();