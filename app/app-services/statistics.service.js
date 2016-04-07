(function () {
    'use strict';

    angular
        .module('app')
        .factory('StatsService', Service);

    function Service($http) {
        var service = {};

        service.Create = Create;

        return service;

        function Create(stat) {
            return $http.post('/api/stats', stat);
        }
    }

})();
