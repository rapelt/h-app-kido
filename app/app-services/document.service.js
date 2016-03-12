(function () {
    'use strict';

    angular
        .module('app')
        .factory('DocumentService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetCurrent() {
            return $http.get('/api/document/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            var then = $http.get('/api/document').then(handleSuccess, handleError);
            return then;
        }

        function GetById(_id) {
            var then = $http.get('/api/document/' + _id).then(handleSuccess, handleError);
            return then;
        }

        function Create(document) {
            return $http.post('/api/document', document).then(handleSuccess, handleError);
        }

        function Update(document) {
            return $http.put('/api/document/' + document._id, document).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/document/' + _id).then(handleSuccess, handleError);
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
