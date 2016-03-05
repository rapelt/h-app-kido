(function () {
    'use strict';

    angular
        .module('app')
        .factory('YoutubeService', Service);

    function Service($http, $rootScope, $q, $window) {

        var service = {};

        service.handleClientLoad = handleClientLoad;

        return service;

        function handleClientLoad() {
            // Step 2: Reference the API key
            gapi.client.setApiKey('AIzaSyAjHu_mLXCkLq32DU9Zg-ltn7h3n8PZhoA');
            window.setTimeout(checkAuth,1);
        }

        function checkAuth() {
            gapi.auth.authorize({
                client_id: '419351503178-2iu5p1rdjou9e3lnsvkhe315mfm06th5.apps.googleusercontent.com',
                //redirect_uri: "http://localhost:3000/app/account",
                //response_type: "token",
                scope: 'https://www.googleapis.com/auth/youtube.readonly'
                //approval_prompt: 'auto'
            }, handleAuthResult);
            //gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
        }

        function handleAuthResult(authResult) {
            if (authResult && !authResult.error) {
                makeApiCall();
            }
        }

        // Load the API and make an API call.  Display the results on the screen.
        function makeApiCall() {
            // Step 4: Load the Google+ API
            gapi.client.load('plus', 'v1').then(function() {
                // Step 5: Assemble the API request
                var token = gapi.auth.getToken();
                console.log(token);
                // Step 6: Execute the API request
                /*request.then(function(resp) {
                    var heading = document.createElement('h4');
                    var image = document.createElement('img');
                    image.src = resp.result.image.url;
                    heading.appendChild(image);
                    heading.appendChild(document.createTextNode(resp.result.displayName));

                    document.getElementById('content').appendChild(heading);
                }, function(reason) {
                    console.log('Error: ' + reason.result.error.message);
                });*/
            });
        }
    }

})();
