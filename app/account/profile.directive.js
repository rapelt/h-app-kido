(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.ProfileController', Controller)
        .directive('profile', function (){
            return {
                templateUrl: 'account/profile.modal.html'
            }

        });

    function Controller($scope) {
        console.log("yay");

    }
})();
