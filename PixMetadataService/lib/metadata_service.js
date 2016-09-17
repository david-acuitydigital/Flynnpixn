"use strict";

var mongodb = require('mongodb'),
    assert = require('assert'),
    config = require('./config');

var MetadataService = {
    "post" : function post(req, res, next){
        mongodb.connect(config.dbUrl, function(err, db) {
          assert.equal(null, err);
          db.collection(config.dbCollection).insertOne(req.body, function (err, r){
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);
            db.close();
            res.json(200, req.body);
            next();
          });
        });
    },

    "del" : function del(req, res, next){
        var id = {_id:new mongodb.ObjectID(req.params["id"])};
        mongodb.connect(config.dbUrl, function(err, db) {
          assert.equal(null, err);
          db.collection(config.dbCollection).findOneAndDelete(id, function (err, r){
            assert.equal(null, err);
            assert.equal(1, r.lastErrorObject.n, `${id._id} not found.`);
            db.close();
            res.json(200, r.value);
            next();
          });
        });
        next();
    },

    "put" : function put(req, res, next){
        var id = {_id:new mongodb.ObjectID(req.params["id"])};
        mongodb.connect(config.dbUrl, function(err, db) {
          assert.equal(null, err);
          db.collection(config.dbCollection).updateOne(id, req.body, {"upsert" : true}, function (err, r){
            assert.equal(null, err);
            assert.equal(1, r.result.n, `${id._id} not inserted.`);
            db.close();
            res.json(200, req.body);
            next();
          });
        });
        next();
    },

    "get" : function get(req, res, next){
        var id = {_id:new mongodb.ObjectID(req.params["id"])};
        mongodb.connect(config.dbUrl, function(err, db) {
          assert.equal(null, err);
          db.collection(config.dbCollection).findOne(id, function (err, doc){
            assert.equal(null, err);
            assert.equal(doc !== null, true, `${id._id} not found.`);
            db.close();
            res.json(200, doc);
            next();
          });
        });
        next();
    },

    "find" : function find(req, res, next){
        var data = {"data": []},
            collection,
            cursor;
        mongodb.connect(config.dbUrl, function(err, db, callback) {
          assert.equal(null, err);
          collection = db.collection(config.dbCollection);
          cursor = collection.find();
          cursor.each(function(err, doc, callback){
            assert.equal(null, err);
            if(doc != null){
                data.data.push(doc);
            } else {
                res.header('Content-Type','application/json');
                res.json(200, data);
                next();
                db.close();
            }
          });
        });
    }
}

module.exports = MetadataService;