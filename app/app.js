(function () {
    'use strict';

    angular
        .module('app', ['permission', 'ui.router', 'youtube-embed', 'soundcloud-widget', 'ngSanitize', 'MassAutoComplete', 'angularSpinners'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {

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
            }).state('editTechniques', {
                url: '/editTechniques',
                templateUrl: 'techniques/index.html',
                controller: 'Techniques.IndexController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'editTechniques',
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'home'
                    }
                }
            }).state('editTranslations', {
                url: '/editTranslations',
                templateUrl: 'translations/index.html',
                controller: 'Translations.IndexController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'editTranslations',
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'home'
                    }
                }
            }).state('classAttendance', {
                url: '/classAttendance',
                templateUrl: 'classAttendance/classAttendance.html',
                controller: 'ClassAttendance.ClassAttendanceController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'classAttendance',
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'home'
                    }
                }
            }).state('gradingDates', {
                url: '/gradingDates',
                templateUrl: 'studentsGradingDates/gradingDates.html',
                controller: 'GradingDates.GradingDatesController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'gradingDates',
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'home'
                    }
                }

            }).state('technique', {
                url: '/technique/:id',
                templateUrl: 'techniques/technique.html',
                controller: 'Technique.TechniqueController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'technique'
                },
                params: {
                    techniquesSet: null,
                    index: null
                }

            }).state('techniques', {
                url: '/techniques',
                templateUrl: 'techniques/techniques.html',
                controller: 'Techniques.TechniquesController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'techniques'
                }
            })
            .state('translation', {
                url: '/translation/:id',
                templateUrl: 'translations/translation.html',
                controller: 'Translation.TranslationController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'translation'
                }

            }).state('translations', {
                url: '/translations',
                templateUrl: 'translations/translations.html',
                controller: 'Translations.TranslationsController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'translations'
                }
            }).state('manual', {
                url: '/manual/:id',
                templateUrl: 'manual/manual.html',
                controller: 'Manual.ManualController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'manual'
                }
            })
            .state('editDocuments', {
                url: '/editDocuments',
                templateUrl: 'manual/index.html',
                controller: 'Documents.IndexController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'editDocuemnts',
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'home'
                    }
                }
            })
            .state('manuals', {
                url: '/manuals',
                templateUrl: 'manual/manuals.html',
                controller: 'Manuals.ManualsController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'manuals'
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

    function run($http, $rootScope, $window, $state, PermissionStore, StatsService, UserService, GradeService) {
        $rootScope.closeDropDown =  function(){
            $('.navbar-collapse').collapse('hide');
        };

        $rootScope.closeDropDownOpenProfileModal = function(){
            $('.navbar-collapse').collapse('hide');
            $('#profileModal').modal('show')
        };

        $rootScope.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

        UserService.GetCurrent().then(function(user){
            $rootScope.currentUser = user;
            var grade = GradeService.UpdateUserGrade($rootScope.currentUser);
            if(grade !== $rootScope.currentUser.grade){
                $rootScope.currentUser.grade = grade;
                UserService.Update($rootScope.currentUser).then(function(user){
                    $rootScope.currentUser = user;
                });
            }
        });

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if(toState != undefined) {
                $rootScope.activeTab = toState.data.activeTab;

                if(toState.name === "technique"){
                    if(toParams.index == null){
                        $state.go('techniques');
                    }
                }
            }

            var stat = { };
            if(toParams.id != undefined){
                stat.id = toParams.id;
            }
            if($rootScope.currentUser != null){
                stat.user = $rootScope.currentUser.username;
                saveStat();
            } else {
                UserService.GetCurrent().then(function(user){
                    stat.user = user.username;
                    $rootScope.currentUser = user;
                    saveStat();
                });
            }

            function saveStat(){
                if(stat.user != "admin"){
                    stat.stat=  toState.name;
                    stat.time = (new Date()).toLocaleString();
                    StatsService.Create(stat);
                }

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


