(function () {
    'use strict';

    angular
        .module('app')
        .controller('Translations.IndexController', Controller);

    function Controller($scope, TranslationService, FlashService, GradeService, UserService) {
        var vm = this;
        vm.deleteTranslation = deleteTranslation;
        vm.editTranslation = editTranslation;
        vm.create = create;
        vm.dismiss = dismiss;
        vm.sort = sort;

        vm.user = {};

        vm.sortBy = ["No Sound File", "All"];

        vm.result1 = '';
        vm.options1 = null;
        vm.details1 = '';

        vm.translation = null;
        vm.oldTranslation = null;
        vm.translationSets =[];
        vm.filters = [];


        var isEdit = false;
        var index = -1;


        vm.translations = []
        vm.sortedTranslations = [];

        initController();

        function initController() {
            TranslationService.GetAll().then(function (translations){
                vm.translations = translations;
                vm.sortedTranslations = translations;

                vm.translationSets = _.groupBy(translations, function(translation){ return translation.group });
                vm.filters = Object.getOwnPropertyNames(vm.translationSets);
            })

            UserService.GetCurrent().then(function(user){
                vm.user = user;
            })

        }

        function sort(sortbyThis){
            if(sortbyThis === "No Sound File"){
                var some= _.filter(vm.translations, function(translation){ return translation.url == undefined });
                vm.sortedTranslations = some;

            } else {
                vm.sortedTranslations = vm.translations;
            }

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
                vm.translationSets = _.groupBy(translations, function(translation){ return translation.group });
                vm.filters = Object.getOwnPropertyNames(vm.translationSets);
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

            if(isEdit == true){
                TranslationService.Update(vm.translation)
                    .then(function () {
                        FlashService.Success('Translation updated');
                        isEdit = false;
                        refresh();
                        vm.translation = null;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                TranslationService.Create(vm.translation)
                    .then(function () {
                        FlashService.Success('Translation created');
                        refresh();
                        vm.translation = null;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }

        }


        function suggest_state(term) {
            var q = term.toLowerCase().trim();
            var results = [];

            if (term.length < 2){
                for (var i = 0; i < vm.filters.length; i++) {
                    var state = vm.filters[i];
                    results.push({ label: state, value: state });
                }
            } else {
                for (var i = 0; i < vm.filters.length; i++) {
                    var state = vm.filters[i];
                    if (state.toLowerCase().indexOf(q) === 0)
                        results.push({ label: state, value: state });
                }


            }

            return results;
        }

        $scope.autocomplete_options = {
            suggest: suggest_state
        };

    }

})();