(function () {
    'use strict';

    angular
        .module('app')
        .factory('TechniqueService', Service);

    function Service($http, $q, $rootScope) {
        var service = {};

        var techniqueSets = [
            "Stepping Form",
            "Break falls",
            "Son Bag Ki",
            "Pal Chagi",
            "Yon Kuel Pal Chagi",
            "Kwon Sool",
            "Kwon Bop",
            "Makko Chagi",
            "Fwall Young Sool",
            "Jumook Makki",
            "Kibon Su",
            "Son Mok Su",
            "Sun Chi Su",
            "Joon Bong Su",
            "Ee Bok Su",
            "Twe Su",
            "Yang Chi Su",
            "Pang Tooki",
            "Pal Makki",
            "Kal Makki"];

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.SortTechniques = SortTechniques;

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

        function SortTechniques(techniquesArray){
            techniquesArray.sort(function(a, b){
                var indexOfa =  _.indexOf(techniqueSets, a);
                var indexOfb =  _.indexOf(techniqueSets, b);
                return indexOfa - indexOfb;
            });

            return techniquesArray;
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
