(function () {
    'use strict';

    angular
        .module('app')
        .factory('TranslationService', Service);

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
            return $http.get('/api/translation/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            var then = $http.get('/api/translation').then(handleSuccess, handleError);
            return then;
        }

        function GetById(_id) {
            var then = $http.get('/api/translation/' + _id).then(handleSuccess, handleError);
            return then;
        }

        function Create(translation) {
            return $http.post('/api/translation', translation).then(handleSuccess, handleError);
        }

        function Update(translation) {
            return $http.put('/api/translation/' + translation._id, translation).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/translation/' + _id).then(handleSuccess, handleError);
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
