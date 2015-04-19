/**
 * For SubCategory Model
 */
var MongoClient = require('mongodb').MongoClient;
var BSON =  require('mongodb').BSONPure;
var settings = require('../../settings');
var Utils = require('../utils');
var ItemCategory = require('./ItemCategory');


function SubCategory(_id, code, desc, category_id, category, created_date, last_updated_date) {
	this._id = _id;
	this.code = code;
	this.desc = desc;
	this.category_id = category_id;
	this.category = category;
	this.created_date = created_date;
	this.last_updated_date = last_updated_date;
}

module.exports = SubCategory;

SubCategory.prototype.save = function save(callback) {
    
	var subCategory = {
			code : this.code,
			desc : this.desc,
			created_date :  new Date(),
			last_updated_date : new Date()
	};
	
	if(this.code.trim()===""){
		return callback("代码不能为空");
	}
	
	ItemCategory.getOne(this.category_id, function(err,result){
		if (err) {
			result = null;
			callback(err);
		}
		subCategory.category = result;
	
	
	
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}


		db.collection('item_sub_category', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			
			collection.ensureIndex({code:1, category:1}, {
                unique: true},
                function (err) {
                    console.log('Error:' + err);
                });
			
			collection.insert(subCategory, function(err, subCategory) {
				
				if (err) {
					db.close();
					callback(err);
				}else {
				
				callback(null, subCategory);

				}
				db.close();
			});

		});
	});
	});
};


SubCategory.prototype.update = function(callback) {
	var subCategory = {
		    _id : this._id,
			code : this.code,
			desc : this.desc,
			category : this.category,
			created_date :  this.created_date,
			last_updated_date : new Date()
	};
	var o_id = new BSON.ObjectID(subCategory._id);
	
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}
		
		db.collection('item_sub_category', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			
			collection.ensureIndex({code:1, category:1}, {
                unique: true},
                function (err) {
                    console.log('Error:' + err);
                });
			
			collection.update({"_id":o_id}, {$set:{code:subCategory.code,desc:subCategory.desc,last_updated_date: subCategory.last_updated_date}}, function(err, subCategory) {

				if (err) {
					db.close();
					return callback(err);
				}
				
				callback(null, subCategory);


				db.close(function(err, subCategory) {
				});
			});

		});
	});
};


SubCategory.remove = function(delIds, callback) {
	
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
		db.collection('item_sub_category', function(err, collection) {
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


SubCategory.getByCategory = function(code,callback){
	
	MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('item_sub_category', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            
            collection.find({"category.code":code}).sort({
            	code: 1
            }).toArray(function (err, docs) {
                db.close();
                if (err) {
                    callback(err, null);
                }
                var subCategories = [];
                console.info(docs.length);
                docs.forEach(function (doc, index) {
                    var subCategory = new SubCategory(doc._id, doc.code, doc.desc, null, doc.category, Utils.dateFormatter(doc.created_date), Utils.dateFormatter(doc.last_updated_date));
                    subCategories.push(subCategory);
                });
                callback(null, subCategories);
            });
        });
    });
};

SubCategory.getAll = function(callback){
	
	MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('item_sub_category', function (err, collection) {
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
                console.info("!!!!!6");
                var subCategories = [];
                docs.forEach(function (doc, index) {
                	
                        var subCategory = new SubCategory(doc._id, doc.code, doc.desc, null, doc.category, Utils.dateFormatter(doc.created_date), Utils.dateFormatter(doc.last_updated_date));
                        subCategories.push(subCategory);
                    
                });
                callback(null, subCategories);
            });
                
        });
    });
};

SubCategory.getOne = function(id,callback){
	console.info('id: ' + id);
	var o_id = new BSON.ObjectID(id);
	MongoClient.connect(settings.url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('item_sub_category', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            
            collection.findOne({'_id':o_id}, function(err, doc) {
            	if (err) {
                    callback(err, null);
                   
                }
            	
            	console.info('doc: ' + doc.code);
            	db.close();
            	var subCategory = new SubCategory(doc._id, doc.code, doc.desc, null, doc.category, doc.created_date, doc.last_updated_date);
            	callback(null, subCategory);
              });
            
           
        });
    });
};

//SubCategory.getAll();

//var sub = new SubCategory(null,'S1','S1D','54be114711fb37ac0e0406e3');
//SubCategory.getByCategory('C1',function(err,re){
//	if(err){
//		console.info('err');
//	}
//	console.info('ok');
//});