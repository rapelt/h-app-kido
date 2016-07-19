(function () {
    'use strict';

    angular
        .module('app')
        .controller('Documents.IndexController', Controller);

    function Controller(DocumentService, FlashService, GradeService, UserService) {
        var vm = this;
        vm.deleteDocument = deleteDocument;
        vm.editDocument = editDocument;
        vm.create = create;
        vm.dismiss = dismiss;
        vm.user = {};


        vm.document = null;
        vm.oldDocument = null;


        var isEdit = false;
        var index = -1;


        vm.documents = [];

        initController();

        function initController() {
            DocumentService.GetAll().then(function (documents){
                vm.documents = documents;
            });

            UserService.GetCurrent().then(function(user){
                vm.user = user;
            });

        }

        function deleteDocument(id) {
            DocumentService.Delete(id)
                .then(function () {
                    refresh();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function editDocument(document, indexs) {
            vm.oldDocument = Object.create(document);
            vm.document = document;
            isEdit = true;
            index = indexs;
        }

        function refresh() {
            DocumentService.GetAll().then(function (documents){
                vm.documents = documents;
            })
        }

        function dismiss(document) {
            if(isEdit == true) {
                DocumentService.GetById(document._id)
                    .then(function (newDocument) {
                        vm.documents[index] = newDocument;
                    })
            }
            vm.document = null;

        }

        function create() {
            vm.document.grade = GradeService.GetCurrent(vm.document.grade.grade);

            if(isEdit == true){
                DocumentService.Update(vm.document)
                    .then(function () {
                        FlashService.Success('Document updated');
                        isEdit = false;
                        refresh();
                        vm.document = null;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                DocumentService.Create(vm.document)
                    .then(function () {
                        FlashService.Success('Document created');
                        refresh();
                        vm.document = null;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }

        }

    }

})();