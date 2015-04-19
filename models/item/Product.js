/**
 * For Product Model
 */
var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSONPure;
var settings = require('../../settings');
var Utils = require('../utils');
var ItemCategory = require('./ItemCategory');
var SubCategory = require('./SubCategory');
var Brand = require('./Brand');

function Product(_id, code, sub_category, brand, name, sizes, sub_category_id, brand_id, created_date, last_update_date) {
	this._id = _id;
	this.code = code;
	this.sub_category = sub_category;
	this.brand = brand;
	this.name = name;
	this.sizes = sizes;
	this.sub_category_id = sub_category_id;
	this.brand_id = brand_id;
	this.created_date = created_date;
	this.last_update_date = last_update_date;
}

module.exports = Product;

Product.prototype.save = function save(callback) {

	var product = {
		code : this.code,
		name : this.name,
		sizes : this.sizes,
		created_date : new Date(),
		last_update_date : new Date()
	};
	
	var brand_id = this.brand_id; 
	SubCategory.getOne(this.sub_category_id, function(err, result) {
		if (err) {
			result = null;
			return callback(err);
		}
		product.sub_category = result;

		Brand.getOne(brand_id, function(err, brand_result) {
			
			if (err) {
				result = null;
				return callback(err);
			}
			product.brand = brand_result;

			MongoClient.connect(settings.url, function(err, db) {
				if (err) {
					return callback(err);
				}

				db.collection('product', function(err, collection) {
					if (err) {
						db.close();
						return callback(err);
					}

					collection.ensureIndex({
						code : 1
					}, {
						unique : true
					}, function(err) {
						console.log('Error:' + err);
					});

					collection.insert(product, function(err, product) {

						if (err) {
							db.close();
							return callback(err);
						}

						callback(null, product);

						db.close();
					});

				});
			});
		});
	});
};

Product.prototype.update = function(callback) {
	var product = {
			_id : this._id,
			code: this.code,
			name : this.name,
			sizes : this.sizes,
			sub_category_id : this.sub_category_id,
			brand_id : this.brand_id,
	};
	
	var o_id = new BSON.ObjectID(product._id);
	
	SubCategory.getOne(product.sub_category_id, function(err, result) {
		if (err) {
			result = null;
			return callback(err);
		}
		
		product.sub_category = result;

		Brand.getOne(product.brand_id, function(err, brand_result) {
			
			if (err) {
				result = null;
				return callback(err);
			}
			product.brand = brand_result;

			MongoClient.connect(settings.url, function(err, db) {
				if (err) {
					return callback(err);
				}

				db.collection('product', function(err, collection) {
					if (err) {
						db.close();
						return callback(err);
					}

					collection.ensureIndex({
						code : 1
					}, {
						unique : true
					}, function(err) {
						console.log('Error:' + err);
					});

					collection.update({
						"_id" : o_id
					}, {
						$set : {
							code : product.code,
							name : product.name,
							sizes : product.sizes,
							brand : product.brand,
							sub_category : product.sub_category,
							last_updated_date : new Date()
						}
					}, function(err, product) {

						if (err) {
							db.close();
							return callback(err);
						}

						callback(null, product);

						db.close(function(err, product) {
						});
					});

				});
			});
		});
	});
};

Product.remove = function(delIds, callback) {

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
		db.collection('product', function(err, collection) {
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

				db.close(function(err, itemCategory) {
				});
			});

		});
	});
};

SubCategory.getByCategory = function(code, callback) {

	MongoClient
			.connect(
					settings.url,
					function(err, db) {
						if (err) {
							return callback(err);
						}
						db
								.collection(
										'item_sub_category',
										function(err, collection) {
											if (err) {
												db.close();
												return callback(err);
											}

											collection
													.find({
														"category.code" : code
													})
													.sort({
														code : 1
													})
													.toArray(
															function(err, docs) {
																db.close();
																if (err) {
																	callback(
																			err,
																			null);
																}
																var subCategories = [];
																console
																		.info(docs.length);
																docs
																		.forEach(function(
																				doc,
																				index) {
																			var subCategory = new SubCategory(
																					doc._id,
																					doc.code,
																					doc.desc,
																					null,
																					doc.category,
																					Utils.dateFormatter(doc.created_date),
																					Utils
																							.dateFormatter(doc.last_updated_date));
																			subCategories
																					.push(subCategory);
																		});
																callback(null,
																		subCategories);
															});
										});
					});
};

/*
 Critieria{
 category.code: category,
 subCategory.code: subCategory,
 brand.code: brand,
 code: code,
 name: name
 }
 */
Product.getByCriteria = function(criteria, callback) {

	MongoClient.connect(settings.url, function(err, db) {
				if (err) {
					return callback(err);
				}
				db.collection('product', function(err, collection) {
							if (err) {
								db.close();
								return callback(err);
							}
							
							collection.find(criteria).sort({code : 1}).toArray( function(err, docs) {
									
								db.close();
								if (err) {
									callback(err, null);
								}
			
								var products = [];
								docs.forEach( function(doc, index) {
									
											var product = new Product(
													doc._id,
													doc.code,
													doc.sub_category,
													doc.brand,
													doc.name,
													doc.sizes,
													null,
													null,
													Utils.dateFormatter(doc.sizes[0].created_date),
													Utils.dateFormatter(doc.sizes[0].last_update_date));
											products.push(product);
								});
								
								callback(null,products);
							});

				});
		});
};

Product.getOne = function(id, callback) {
	console.info('id: ' + id);
	var o_id = new BSON.ObjectID(id);
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('product', function(err, collection) {
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

				console.info('doc: ' + doc.code);
				db.close();
				var product = new Product(doc._id, doc.code, doc.sub_category, doc.brand, doc.name, doc.sizes, null, null, doc.created_date, doc.last_update_date);
				callback(null, product);
			});

		});
	});
};

// SubCategory.getAll();

// var sub = new SubCategory(null,'S1','S1D','54be114711fb37ac0e0406e3');
// SubCategory.getByCategory('C1',function(err,re){
// if(err){
// console.info('err');
// }
// console.info('ok');
// });

//test

//var criteria ={};
//var sub_category ={};
//var category={};
//var brand={};
//
////criteria.brand = brand;
////criteria.brand.code = 'Chanel';
//
//criteria["brand.code"] = "Chanel";
//console.info(JSON.stringify(criteria, null, 4));
//Product.getByCriteria(criteria, function(err,products){
//	if (err) {
//		 console.info("!!!!!==22");
//		 products = [];
//	}
//	 console.info("!!!!!3");
//	 console.info(JSON.stringify(products));
//
//});
