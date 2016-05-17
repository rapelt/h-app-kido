var config = require('config.json');
var express = require('express');
var router = express.Router();
var statsService = require('services/statistics.service');

// routes
router.post('/', registerStat);
router.get('/:username', getUserStatistic);

module.exports = router;

function registerStat(req, res) {
    statsService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        });
}

function getUserStatistic(req, res) {
    statsService.getByUserName(req.params.username)
        .then(function (stat) {
            if (stat) {
                res.send(stat);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}