var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var database = null;
//Db.connect(mongoUrl, {}, function (error, db) {
//    console.log("connected, db: " + mongoUrl + "  " + db);
//
//    database = db;
//
//    database.addListener("error", function (error) {
//        console.log("Error connecting to MongoLab");
//
//    });
//});
//module.exports = database;
//module.exports = new Db('heroku_app31751679', new Server(settings.url, settings.port));