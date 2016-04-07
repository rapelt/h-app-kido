var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI);
var statsDB = db.get('stats');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var service = {};

service.create = create;

module.exports = service;

function create(statsParam) {
    var deferred = Q.defer();

    var stats = statsParam;

    statsDB.insert(
        stats,
        function (err, doc) {
            if (err) deferred.reject(err);

            deferred.resolve();});

    return deferred.promise;
}
