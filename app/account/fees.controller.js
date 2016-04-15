(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.Fees', Controller)
        .directive('fees', function (){
            return {
                templateUrl: 'account/fees.html'
            }

        });

    function Controller() {
    }
})();
