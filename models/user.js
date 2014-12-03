var connect = require('connect');
var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var mongodb =  require('./db');
var MongoClient = require('mongodb').MongoClient;

function User(user) {
    this.name = user.name;
    this.password = user.password;
};
module.exports = User;
User.prototype.save = function save(callback) {
    // 瀛樺叆 Mongodb 鐨勬枃妗�
    var user = {
        name: this.name,
        password: this.password,
    };
//     mongodb.open(function (err, db) {
    MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            return callback(err);
        }
        // 璇诲彇 users 闆嗗悎
        db.collection('users', function (err, collection) {
            if (err) {
                return db.close(callback(err));
            }
            // 涓�name 灞炴�娣诲姞绱㈠紩
            collection.ensureIndex('name', {
                unique: true},
                function (err) {
                    console.log('Error1:' + err);
                });
            // 鍐欏叆 user 鏂囨。
            collection.insert(user, function (err, user) {

                if (err) {
                    return callback(err);
                }
                callback(null);
                db.close(function (err, post) {
                    console.log('Error2:' + err);
                });


            });
        });
    });
};
User.get = function get(username, callback) {
//     mongodb.open(function (err, db) {
	MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            console.log("Error Here 11");
            return callback(err);
        }
        // 璇诲彇 users 闆嗗悎
        db.collection('users', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            // 鏌ユ壘 name 灞炴�涓�username 鐨勬枃妗�
            collection.findOne({
                name: username
            }, function (err, doc) {
                db.close();
                if (doc) {
                    // 灏佽鏂囨。涓�User 瀵硅薄
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};