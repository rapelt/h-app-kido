var config = require('config.json');
var express = require('express');
var router = express.Router();
var documentService = require('services/document.service');

// routes
router.post('/register', registerDocument);
router.get('/:_id', getCurrentDocument);
router.put('/:_id', updateDocument);
router.delete('/:_id', deleteDocument);
router.post('/', registerDocument);
router.get('/', getAllDocuments);



module.exports = router;

function registerDocument(req, res) {
    documentService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentDocument(req, res) {
    documentService.getById(req.params._id)
        .then(function (document) {
            if (document) {
                console.log(document);
                res.send(document);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllDocuments(req, res) {
    documentService.getAll()
        .then(function (users) {
            if (users) {
                res.send(users);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateDocument(req, res) {
    documentService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteDocument(req, res) {
    documentService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}