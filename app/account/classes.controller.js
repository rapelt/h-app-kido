(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.Classes', Controller)
        .directive('classes', function (){
            return {
                templateUrl: 'account/classes.html'
            }

        });

    function Controller($scope) {
        console.log("yay");

    }
})();
