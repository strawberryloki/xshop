var connect = require('connect');
var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var mongodb = require('./db');
var MongoClient = require('mongodb').MongoClient;

function Post(username, post, time) {
    this.user = username;
    this.post = post;
    if (time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
}
module.exports = Post;
Post.prototype.save = function save(callback) {
    var post = {
        user: this.user,
        post: this.post,
        time: this.time,
    };
    MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            return callback(err);
        }
            
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.ensureIndex({
                "user": 1
            }, {
                "unique": true
            }, function (err) {
                console.log('Error1:' + err);
            });
            collection.insert(post, function (err, post) {

                callback(err, post);

                db.close(function (err, post) {
                    console.log('Error2:' + err);
                });
            });

        });
    });
};
Post.get = function get(username, callback) {

	MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (username) {
                query.user = username;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                db.close();
                if (err) {
                    callback(err, null);
                }
                var posts = [];
                docs.forEach(function (doc, index) {
                    var post = new Post(doc.user, doc.post, doc.time);
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};