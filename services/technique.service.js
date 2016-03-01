var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI);
var techniquesDb = db.get('assets');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var service = {};

service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getAll = getAll;


module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    techniquesDb.findById(_id, function (err, technique) {
        if (err) deferred.reject(err);

        if (technique) {
            // return user (without hashed password)
            deferred.resolve(_.omit(technique, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    techniquesDb.find({}, function (err, technique) {
        if (err) deferred.reject(err);

        if (technique) {
            // return user (without hashed password)
            deferred.resolve(_.omit(technique, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(techniqueParam) {
    var deferred = Q.defer();

    // validation
    techniquesDb.findOne(
        { techniqueName: techniqueParam.techniqueName },
        function (err, technique) {
            if (err) deferred.reject(err);


            if (technique) {
                // username already exists
                deferred.reject('Technique "' + techniqueParam.techniqueName + '" already exists');
            } else {
                createTechnique();
            }
        });

    function createTechnique() {
        var technique = techniqueParam;

        techniquesDb.insert(
            technique,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, techniqueParam) {
    var deferred = Q.defer();

    // validation
    techniquesDb.findById(_id, function (err, technique) {
        console.log(technique);
        if (err) deferred.reject(err);

        if (technique.techniqueName !== techniqueParam.techniqueName) {
            // username has changed so check if the new username is already taken
            techniquesDb.findOne(
                { techniqueName: techniqueParam.techniqueName },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.techniqueName + '" is already taken')
                    } else {
                        updateTechnique();
                    }
                });
        } else {
            updateTechnique();
        }
    });

    function updateTechnique() {
        // fields to update
        var set = {
            url: techniqueParam.url,
            techniqueName: techniqueParam.techniqueName,
            techniqueSet: techniqueParam.techniqueSet,
            grade: techniqueParam.grade,
            assetType: techniqueParam.assetType
        };

        techniquesDb.findAndModify(
            { _id: _id },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    techniquesDb.remove(
        { _id: _id },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}