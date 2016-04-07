var config = require('config.json');
var express = require('express');
var router = express.Router();
var statsService = require('services/statistics.service');

// routes
router.post('/', registerStat);

module.exports = router;

function registerStat(req, res) {
    statsService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        });
}