(function () {
    'use strict';

    angular
        .module('app')
        .controller('Translations.IndexController', Controller);

    function Controller($state, TranslationService, FlashService, GradeService, UserService) {
        var vm = this;
        vm.deleteTranslation = deleteTranslation;
        vm.editTranslation = editTranslation;
        vm.create = create;
        vm.dismiss = dismiss;
        vm.user = {};


        vm.translation = null;
        vm.oldTranslation = null;


        var isEdit = false;
        var index = -1;


        vm.translations = [];

        initController();

        function initController() {
            TranslationService.GetAll().then(function (translations){
                vm.translations = translations;
            })

            UserService.GetCurrent().then(function(user){
                vm.user = user;
            })

        }

        function deleteTranslation(id) {
            TranslationService.Delete(id)
                .then(function () {
                    refresh();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function editTranslation(translation, indexs) {
            vm.oldTranslation = Object.create(translation);
            vm.translation = translation;
            isEdit = true;
            index = indexs;
        }

        function refresh() {
            TranslationService.GetAll().then(function (translations){
                vm.translations = translations;
            })
        }

        function dismiss(translation) {
            if(isEdit == true) {
                TranslationService.GetById(translation._id)
                    .then(function (newTranslation) {
                        vm.translations[index] = newTranslation;
                    })
            }
            vm.translation = null;

        }

        function create() {
            vm.translation.grade = GradeService.GetCurrent(vm.translation.grade.grade);
            console.log(vm.translation);

            if(isEdit == true){
                TranslationService.Update(vm.translation)
                    .then(function () {
                        FlashService.Success('Translation created');
                        isEdit = false;
                        //$state.reload();
                        vm.translation = null;
                        TranslationService.GetAll().then(function (translations){
                            vm.translations = translations;
                        })
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                TranslationService.Create(vm.translation)
                    .then(function () {
                        FlashService.Success('Translation created');
                        $state.reload();
                        vm.translation = null;
                        TranslationService.GetAll().then(function (translations){
                            vm.translations = translations;
                        })
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }

        }

    }

})();