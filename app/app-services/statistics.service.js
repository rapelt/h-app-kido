(function () {
    'use strict';

    angular
        .module('app')
        .factory('StatsService', Service);

    function Service($http) {
        var service = {};

        service.Create = Create;
        service.GetByUsername = GetByUsername;


        return service;

        function Create(stat) {
            return $http.post('/api/stats', stat);
        }

        function GetByUsername(user) {
            return $http.get('/api/stats/' + user.username, user).then(handleSuccess, handleError);;
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
