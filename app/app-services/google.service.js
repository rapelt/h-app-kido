(function () {
    'use strict';

    angular
        .module('app')
        .factory('GoogleService', Service);

    function Service($q, $rootScope) {

        var service = {};

        service.checkAuth = checkAuth;
        service.callScriptFunction = callScriptFunction;
        service.checkAuthImmidiateFalse = checkAuthImmidiateFalse;

        return service;

        function checkAuth() {
            return  $q(function(resolve, reject) {
                $rootScope.resolve = resolve;
                $rootScope.reject = reject;
                gapi.auth.authorize(
                    {
                        'client_id': '419351503178-jm561iaknf03222on371r2k8i70gq6iu.apps.googleusercontent.com',
                        'scope': ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'],
                        'immediate': true
                    }, handleAuthResult);
            });
        }

        function checkAuthImmidiateFalse() {
            return  $q(function(resolve, reject) {
                $rootScope.resolve = resolve;
                $rootScope.reject = reject;
                gapi.auth.authorize(
                    {
                        'client_id': '419351503178-jm561iaknf03222on371r2k8i70gq6iu.apps.googleusercontent.com',
                        'scope': ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/script.external_request'],
                        'immediate': false
                    }, handleAuthResult);
            });
        }

        function handleAuthResult(authResult) {
            if (authResult && !authResult.error) {
                console.log("Auth Result Success");
                $rootScope.googleHasBeenAuthenticated = true;
                $rootScope.resolve();
            } else {
                console.log("Auth Result Error");
                $rootScope.googleHasBeenAuthenticated = false;
                $rootScope.reject();
            }
        }

        function callScriptFunction(functionCall, sheetName) {
            return  $q(function(resolve, reject){
                var scriptId = "MBV_Z3D3OWA25DQYD_33QWMMdb2HX2nNI";

                var request = {
                    'function': functionCall,
                    'devMode': false,
                    'parameters': [sheetName]
                };

                var op = gapi.client.request({
                    'root': 'https://script.googleapis.com',
                    'path': 'v1/scripts/' + scriptId + ':run',
                    'method': 'POST',
                    'body': request
                });

                op.execute(function(resp) {
                    if (resp.error && resp.error.status) {
                        reject('Error calling API:'+ resp.error.message);
                    } else if (resp.error) {
                        var error = resp.error.details[0];
                        reject('Script error message: ' + error.errorMessage);

                        if (error.scriptStackTraceElements) {
                            reject('Script error stacktrace:');
                            for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                                var trace = error.scriptStackTraceElements[i];
                                reject('\t' + trace.function + ':' + trace.lineNumber);
                            }
                        }
                    } else {
                        resolve(resp.response.result);
                    }
                });
            });
        }

    }

})();
