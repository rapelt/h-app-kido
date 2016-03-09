var config = require('config.json');
var express = require('express');
var router = express.Router();
var translationService = require('services/translation.service');

// routes
router.post('/register', registerTranslation);
router.get('/:_id', getCurrentTranslation);
router.put('/:_id', updateTranslation);
router.delete('/:_id', deleteTranslation);
router.post('/', registerTranslation);
router.get('/', getAllTranslations);



module.exports = router;

function registerTranslation(req, res) {
    translationService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentTranslation(req, res) {
    translationService.getById(req.params._id)
        .then(function (translation) {
            if (translation) {
                console.log(translation);
                res.send(translation);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTranslations(req, res) {
    translationService.getAll()
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

function updateTranslation(req, res) {
    translationService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteTranslation(req, res) {
    translationService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}