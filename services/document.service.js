var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI);
var documentsDb = db.get('documents');
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

    documentsDb.findById(_id, function (err, document) {
        if (err) deferred.reject(err);

        if (document) {
            // return user (without hashed password)
            deferred.resolve(_.omit(document, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    documentsDb.find({}, function (err, document) {
        if (err) deferred.reject(err);

        if (document) {
            // return user (without hashed password)
            deferred.resolve(_.omit(document, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(documentParam) {
    var deferred = Q.defer();

    // validation
    documentsDb.findOne(
        { fileName: documentParam.fileName },
        function (err, document) {
            if (err) deferred.reject(err);


            if (document) {
                // username already exists
                deferred.reject('Document "' + documentParam.fileName + '" already exists');
            } else {
                createDocument();
            }
        });

    function createDocument() {
        var document = documentParam;

        documentsDb.insert(
            document,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, documentParam) {
    var deferred = Q.defer();

    // validation
    documentsDb.findById(_id, function (err, document) {
        console.log(document);
        if (err) deferred.reject(err);

        if (document.fileName !== documentParam.fileName) {
            // username has changed so check if the new username is already taken
            documentsDb.findOne(
                { fileName: documentParam.fileName },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.fileName + '" is already taken')
                    } else {
                        updateDocument();
                    }
                });
        } else {
            updateDocument();
        }
    });

    function updateDocument() {
        // fields to update
        var set = {
            url: documentParam.url,
            fileName: documentParam.fileName,
            grade: documentParam.grade,
        };

        documentsDb.findAndModify(
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

    documentsDb.remove(
        { _id: _id },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}