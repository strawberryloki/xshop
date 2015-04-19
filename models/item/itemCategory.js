/**
 * For ItemCategory Model
 */
var MongoClient = require('mongodb').MongoClient;
var BSON =  require('mongodb').BSONPure;
var settings = require('../../settings');
var Utils = require('../utils');


function ItemCategory(_id, code, desc, created_date, last_updated_date) {
	this._id = _id;
	this.code = code;
	this.desc = desc;
	this.created_date = created_date;
	this.last_updated_date = last_updated_date;
}

module.exports = ItemCategory;

ItemCategory.prototype.save = function save(callback) {
	
	var itemCategory = {
			code : this.code,
			desc : this.desc,
			created_date :  new Date(),
			last_updated_date : new Date()
	};
	
	
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('item_category', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			
			collection.ensureIndex({code:1}, {
                unique: true},
                function (err) {
                    console.log('Error:' + err);
                });
			
			collection.insert(itemCategory, function(err, itemCategory) {
				
				if (err) {
					db.close();
					return callback(err);
				}
				
				callback(null, itemCategory);

				db.close(function(err, itemCategory) {
				});
			});

		});
	});
};


ItemCategory.prototype.update = function(callback) {
	var itemCategory = {
		    _id : this._id,
			code : this.code,
			desc : this.desc,
			created_date :  this.created_date,
			last_updated_date : new Date()
	};
	var o_id = new BSON.ObjectID(itemCategory._id);
	
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}
		
		db.collection('item_category', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			
			collection.ensureIndex({code:1}, {
                unique: true},
                function (err) {
                    console.log('Error:' + err);
                });
			
			collection.update({"_id":o_id}, {"code":itemCategory.code, "desc":itemCategory.desc, "created_date":itemCategory.created_date, "last_updated_date": itemCategory.last_updated_date}, function(err, itemCategory) {

				if (err) {
					db.close();
					return callback(err);
				}
				
				callback(null, itemCategory);


				db.close(function(err, itemCategory) {
				});
			});

		});
	});
};


ItemCategory.remove = function(delIds, callback) {
	
	var temp = [];
	if(!(delIds instanceof Array)){
		temp.push(delIds);
	} else {
		temp = delIds.concat();
	}
	var removeId = [];
	console.info(temp);
	temp.forEach(function(content){
		console.info("Content: " +content);
		var o_id = new BSON.ObjectID(content);
		removeId.push(o_id);
	});
	
	
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('item_category', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			
			collection.remove({"_id":{ $in : removeId}}, function(err, count) {

				if (err) {
					db.close();
					return callback(err);
				}
				
				console.info("delete-"+count);
				


				db.close(function(err, itemCategory) {
				});
			});

		});
	});
};


ItemCategory.getAll = function(callback){
	
	
	MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('item_category', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            
            collection.find().sort({
            	code: 1
            }).toArray(function (err, docs) {
                db.close();
                if (err) {
                    callback(err, null);
                }
                var itemCategories = [];
                docs.forEach(function (doc, index) {
                    var itemCategory = new ItemCategory(doc._id, doc.code, doc.desc, Utils.dateFormatter(doc.created_date), Utils.dateFormatter(doc.last_updated_date));
                    itemCategories.push(itemCategory);
                });
                callback(null, itemCategories);
            });
        });
    });
};



ItemCategory.getOne = function(id,callback){
	console.info('id: ' + id);
	var o_id = new BSON.ObjectID(id);
	MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('item_category', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            
            console.info('here1');
            collection.findOne({'_id':o_id}, function(err, doc) {
            	if (err) {
            		 console.info('here2');
                    callback(err, null);
                   
                }
            	
            	console.info('doc: ' + doc.code);
            	db.close();
            	var itemCategory = new ItemCategory(doc._id, doc.code, doc.desc, doc.created_date, doc.last_updated_date);
            	callback(null, itemCategory);
              });
            
           
        });
    });
};
