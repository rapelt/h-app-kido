(function () {
    'use strict';

    angular
        .module('app', ['permission', 'ui.router', 'youtube-embed'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        //$locationProvider.html5Mode({
        //    enabled:true,
        //    requireBase: false
        //
        //})

        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: '' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('register2', {
                url: '/register2',
                templateUrl: 'register/index.html',
                controller: 'Register.IndexController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'editUser',
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'home'
                    }
                }
            }).state('techniques', {
                url: '/techniques',
                templateUrl: 'techniques/index.html',
                controller: 'Techniques.IndexController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'techniques',
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'home'
                    }
                }
            })
            .state('editUser', {
                url: '/editUser',
                templateUrl: 'editUser/index.html',
                controller: 'EditUser.IndexController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'editUser',
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'home'
                    }
                }
            });

    }

    function run($http, $rootScope, $window, $q, RoleStore, PermissionStore) {

        PermissionStore.definePermission('student', function() {
            if($rootScope.currentUser != undefined){
                return $rootScope.currentUser.isAdmin === false;
            }
            return true;
        });

        PermissionStore.definePermission('admin', function() {
            if($rootScope.currentUser != undefined){
                return $rootScope.currentUser.isAdmin;
            }
            return false;
        });

        //add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if(toState != undefined) {
                $rootScope.activeTab = toState.data.activeTab;
            }
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['app']);
        });
    });



})();


