(function () {
    'use strict';

    angular
        .module('app')
        .factory('TechniqueService', Service);

    function Service($http, $q, $rootScope) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetCurrent() {
            return $http.get('/api/technique/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            var then = $http.get('/api/technique').then(handleSuccess, handleError);
            return then;
        }

        function GetById(_id) {
            var then = $http.get('/api/technique/' + _id).then(handleSuccess, handleError);
            return then;
        }

        function Create(technique) {
            return $http.post('/api/technique', technique).then(handleSuccess, handleError);
        }

        function Update(technique) {
            return $http.put('/api/technique/' + technique._id, technique).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/technique/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
