(function () {
    'use strict';

    angular
        .module('app')
        .factory('GoogleService', Service);

    function Service($q) {

        var service = {};

        service.checkAuth = checkAuth;
        service.callScriptFunction = callScriptFunction;

        return service;

        function checkAuth() {
            gapi.auth.authorize(
                {
                    'client_id': '419351503178-jm561iaknf03222on371r2k8i70gq6iu.apps.googleusercontent.com',
                    'scope': ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'],
                    'immediate': true
                }, handleAuthResult);
        }

        function handleAuthResult(authResult) {
            if (authResult && !authResult.error) {
                console.log("Auth Result Success");
            } else {
                console.log("Auth Result Error");

                gapi.auth.authorize(
                    {
                        'client_id': '419351503178-jm561iaknf03222on371r2k8i70gq6iu.apps.googleusercontent.com',
                        'scope': ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'],
                        'immediate': false
                    }, handleAuthResult);
            }
        }

        function callScriptFunction(functionCall) {
            return  $q(function(resolve, reject){
                var scriptId = "MBV_Z3D3OWA25DQYD_33QWMMdb2HX2nNI";

                // Create an execution request object.
                var request = {
                    'function': functionCall,
                    'devMode': true
                };

                // Make the API request.
                var op = gapi.client.request({
                    'root': 'https://script.googleapis.com',
                    'path': 'v1/scripts/' + scriptId + ':run',
                    'method': 'POST',
                    'body': request
                });

                op.execute(function(resp) {
                    if (resp.error && resp.error.status) {
                        // The API encountered a problem before the script
                        // started executing.
                        reject('Error calling API:');
                        reject(JSON.stringify(resp, null, 2));
                    } else if (resp.error) {
                        // The API executed, but the script returned an error.

                        // Extract the first (and only) set of error details.
                        // The values of this object are the script's 'errorMessage' and
                        // 'errorType', and an array of stack trace elements.
                        var error = resp.error.details[0];
                        reject('Script error message: ' + error.errorMessage);

                        if (error.scriptStackTraceElements) {
                            // There may not be a stacktrace if the script didn't start
                            // executing.
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
