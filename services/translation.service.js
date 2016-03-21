var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI);
var translationsDb = db.get('translations');
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

    translationsDb.findById(_id, function (err, translation) {
        if (err) deferred.reject(err);

        if (translation) {
            // return user (without hashed password)
            deferred.resolve(_.omit(translation, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    translationsDb.find({}, function (err, translation) {
        if (err) deferred.reject(err);

        if (translation) {
            // return user (without hashed password)
            deferred.resolve(_.omit(translation, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(translationParam) {
    var deferred = Q.defer();

    // validation
    translationsDb.findOne(
        { korean: translationParam.korean },
        function (err, translation) {
            if (err) deferred.reject(err);


            if (translation) {
                // username already exists
                deferred.reject('translation "' + translationParam.korean + '" already exists');
            } else {
                createtranslation();
            }
        });

    function createtranslation() {
        var translation = translationParam;

        translationsDb.insert(
            translation,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, translationParam) {
    var deferred = Q.defer();

    // validation
    translationsDb.findById(_id, function (err, translation) {
        if (err) deferred.reject(err);

        if (translation.korean !== translationParam.korean) {
            // username has changed so check if the new username is already taken
            translationsDb.findOne(
                { korean: translationParam.korean },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.korean + '" is already taken')
                    } else {
                        updatetranslation();
                    }
                });
        } else {
            updatetranslation();
        }
    });

    function updatetranslation() {
        // fields to update
        var set = {
            url: translationParam.url,
            korean: translationParam.korean,
            english: translationParam.english,
            grade: translationParam.grade,
            group: translationParam.group
        };

        translationsDb.findAndModify(
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

    translationsDb.remove(
        { _id: _id },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}