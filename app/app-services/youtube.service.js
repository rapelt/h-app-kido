(function () {
    'use strict';

    angular
        .module('app')
        .factory('YoutubeService', Service);

    function Service($http, $rootScope, $q, $window) {

        var OAUTH2_SCOPES = [
            'https://www.googleapis.com/auth/youtube.readonly'
        ];
        var service = {};

        service.login = login;
        service.handleClientLoad = handleClientLoad;
        service.handleAuthClick = handleAuthClick;
        service.checkAuth = checkAuth;
        service.initGapi = initGapi;

        return service;

        var clientId = '419351503178-k28g7593kdggrpf48vqgslf43om65klt.apps.googleusercontent.com';
        var apiKey = 'AIzaSyAjHu_mLXCkLq32DU9Zg-ltn7h3n8PZhoA';
        var scopes = OAUTH2_SCOPES;

        function initGapi() {
            var something = gapi.auth.authorize({
                client_id: '419351503178-2iu5p1rdjou9e3lnsvkhe315mfm06th5.apps.googleusercontent.com',
                redirect_uri: "http://localhost:3000/app/account",
                response_type: "token",
                scope: 'https://www.googleapis.com/auth/youtube',
                approval_prompt: 'auto'
            }, this.handleAuthResult);

            console.log(something);

            return $q.defer().promise;
        }

        function login () {
        }

        function handleClientLoad () {
            gapi.client.setApiKey(apiKey);
            gapi.auth.init(function () { });
            window.setTimeout(checkAuth, 1);
        };

        function checkAuth() {
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: true,
            }, this.handleAuthResult);
        };

        this.handleAuthResult = function(authResult) {
            if (authResult && !authResult.error) {
                var data = {};
                gapi.client.load('oauth2', 'v2', function () {
                    var request = gapi.client.oauth2.userinfo.get();
                    request.execute(function (resp) {
                        data.email = resp.email;
                    });
                });
                deferred.resolve(data);
            } else {
                deferred.reject('error');
            }
        };

        function handleAuthClick(event) {
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: false,
            }, this.handleAuthResult);
            return false;
        };

    }

})();
