var config = require('config.json');
var express = require('express');
var router = express.Router();
var techniqueService = require('services/technique.service');

// routes
router.post('/register', registerTechnique);
router.get('/:_id', getCurrentTechnique);
router.put('/:_id', updateTechnique);
router.delete('/:_id', deleteTechnique);
router.post('/', registerTechnique);
router.get('/', getAllTechniques);



module.exports = router;

function registerTechnique(req, res) {
    techniqueService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentTechnique(req, res) {
    techniqueService.getById(req.params._id)
        .then(function (technique) {
            if (technique) {
                console.log(technique);
                res.send(technique);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTechniques(req, res) {
    techniqueService.getAll()
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

function updateTechnique(req, res) {
    techniqueService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteTechnique(req, res) {
    techniqueService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}