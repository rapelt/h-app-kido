(function () {
    'use strict';

    angular
        .module('app')
        .controller('Techniques.IndexController', Controller);

    function Controller($window, $rootScope, $state, TechniqueService, FlashService, GradeService, UserService) {
        var vm = this;
        vm.deleteTechnique = deleteTechnique;
        vm.editTechnique = editTechnique;
        vm.create = create;
        vm.dismiss = dismiss;
        vm.user = {};


        vm.technique = null;
        vm.oldTechnique = null;


        var isEdit = false;
        var index = -1;


        vm.techniques = [];

        initController();

        function initController() {
            TechniqueService.GetAll().then(function (techniques){
                vm.techniques = techniques;
            })

            UserService.GetCurrent().then(function(user){
                vm.user = user;
            })

        }

        function deleteTechnique(id) {
            TechniqueService.Delete(id)
                .then(function () {
                    refresh();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function editTechnique(technique, indexs) {
            vm.oldTechnique = Object.create(technique);
            vm.technique = technique;
            isEdit = true;
            index = indexs;
        }

        function refresh() {
            TechniqueService.GetAll().then(function (techniques){
                vm.techniques = techniques;
            })
        }

        function dismiss(technique) {
            if(isEdit == true) {
                TechniqueService.GetById(technique._id)
                    .then(function (newTechnique) {
                        vm.techniques[index] = newTechnique;
                    })
            }
        }

        function create() {
            vm.technique.grade = GradeService.GetCurrent(vm.technique.grade.grade);
            console.log(vm.technique);

            if(isEdit == true){
                TechniqueService.Update(vm.technique)
                    .then(function () {
                        FlashService.Success('Technique created');
                        isEdit = false;
                        //$state.reload();
                        vm.technique = null;
                        TechniqueService.GetAll().then(function (techniques){
                            vm.techniques = techniques;
                        })
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                TechniqueService.Create(vm.technique)
                    .then(function () {
                        FlashService.Success('Technique created');
                        $state.reload();
                        vm.technique = null;
                        TechniqueService.GetAll().then(function (techniques){
                            vm.techniques = techniques;
                        })
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }

        }

    }

})();