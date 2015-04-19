/**
 * For Customer Model
 */
var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSONPure;
var settings = require('../../settings');
var Utils = require('../utils');
var ItemCategory = require('./ItemCategory');
var SubCategory = require('./SubCategory');
var Brand = require('./Brand');

function Customer(_id, name, tel_no, addresses, remark, created_date,last_update_date) {
	this._id = _id;
	this.name = name;
	this.tel_no = tel_no;
	this.addresses = addresses;
	this.remark = remark;
	this.created_date = created_date;
	this.last_update_date = last_update_date;
}

module.exports = Customer;

Customer.prototype.save = function save(callback) {

	var customer = {
		name : this.name,
		tel_no : this.tel_no,
		addresses : this.addresses,
		remark : this.remark,
		created_date : new Date(),
		last_update_date : new Date()
	};
	
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('customer', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			
			collection.ensureIndex({name:1}, {
                unique: true},
                function (err) {
                    console.log('Error:' + err);
                });
			
			collection.insert(customer, function(err, customer) {
				
				if (err) {
					db.close();
					return callback(err);
				}
				
				callback(null, customer);

				db.close(function(err, customer) {
				});
			});

		});
	});
};

Customer.prototype.update = function(callback) {
		
		var customer = {
			_id : this._id,
			name : this.name,
			tel_no : this.tel_no,
			addresses : this.addresses,
			remark : this.remark,
		};
	
	var o_id = new BSON.ObjectID(customer._id);
	

			MongoClient.connect(settings.url, function(err, db) {
				if (err) {
					return callback(err);
				}

				db.collection('customer', function(err, collection) {
					if (err) {
						db.close();
						return callback(err);
					}

					collection.ensureIndex({
						name : 1
					}, {
						unique : true
					}, function(err) {
						console.log('Error:' + err);
					});

					collection.update({
						"_id" : o_id
					}, {
						$set : {
							name : customer.name,
							tel_no : customer.tel_no,
							addresses : customer.addresses,
							remark : customer.remark,
							last_updated_date : new Date()
						}
					}, function(err, customer) {

						if (err) {
							db.close();
							return callback(err);
						}

						callback(null, customer);

						db.close(function(err, customer) {
						});
					});

				});
			});
};

Customer.remove = function(delIds, callback) {

	var temp = [];
	if (!(delIds instanceof Array)) {
		temp.push(delIds);
	} else {
		temp = delIds.concat();
	}
	var removeId = [];
	console.info(temp);
	temp.forEach(function(content) {
		console.info("Content: " + content);
		var o_id = new BSON.ObjectID(content);
		removeId.push(o_id);
	});

	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('customer', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}

			collection.remove({
				"_id" : {
					$in : removeId
				}
			}, function(err, count) {

				if (err) {
					db.close();
					return callback(err);
				}

				console.info("delete-" + count);

				db.close(function(err, customer) {
				});
			});

		});
	});
};


/*
 Critieria{
 
 name: name
 }
 */
Customer.getByCriteria = function(criteria, callback) {

	MongoClient.connect(settings.url, function(err, db) {
				if (err) {
					return callback(err);
				}
				db.collection('product', function(err, collection) {
					if (err) {
						db.close();
						return callback(err);
					}
					
					collection.find(criteria).sort({name : 1}).toArray( function(err, docs) {
							
						db.close();
						if (err) {
							callback(err, null);
						}
	
						var customers = [];
						docs.forEach( function(doc, index) {
							var customer = new Customer(doc._id, doc.name, doc.tel_no, doc.addresses, doc.remark, Utils.dateFormatter(doc.created_date),
									Utils.dateFormatter(doc.last_update_date));
							customers.push(customer);
						});
						
						callback(null,customers);
					});
				});
		});
};

Customer.getOne = function(id, callback) {
	console.info('id: ' + id);
	var o_id = new BSON.ObjectID(id);
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('customer', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}

			collection.findOne({
				'_id' : o_id
			}, function(err, doc) {
				if (err) {
					callback(err, null);

				}

				console.info('doc: ' + doc.name);
				db.close();
				var customer =new Customer(doc._id, doc.name, doc.tel_no, doc.addresses, doc.remark, Utils.dateFormatter(doc.created_date), Utils.dateFormatter(doc.last_update_date));
				callback(null, customer);
			});

		});
	});
};


