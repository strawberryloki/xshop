/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var ItemCategory = require('../models/item/ItemCategory.js');
var Brand = require('../models/item/Brand.js');
var SubCategory = require('../models/item/SubCategory.js');
var Product = require('../models/item/Product.js');
var Utils = require('../models/utils');
module.exports = router;
//======================================================================================

// ================================ Item Category ======================================

//======================================================================================

/* GET Item Category - Create. */
router.get('/ItemCategory/create', function(req, res) {

	ItemCategory.getAll(function(err, itemCategories) {
		if (err) {
			itemCategories = [];
		}
		res.render('./itemManager/ItemCategory/create', {
			itemCategories : itemCategories
		});

	});

});

/* GET Item Category - Edit. */
router.get('/ItemCategory/edit/:id', function(req, res) {

	ItemCategory.getOne(req.params.id, function(err, itemCategory) {
		if (err) {
			itemCategory = null;
		}
		req.session.edit = itemCategory;
		var o = req.session.edit;
		console.info("@@" + o.created_date);
		res.render('./itemManager/ItemCategory/edit', {
			itemCategory : itemCategory,
		});

	});

});

/* POST Item Category - Create */
router.post('/ItemCategory/create', function(req, res) {

	var itemCategory = new ItemCategory(null, req.body.code, req.body.desc);

	itemCategory.save(function(err) {
		if (err) {
			req.session.error = "代码已经存在";
			return res.redirect('./create');
		}
		req.session.success = '新建成功';
		res.redirect('./create');
	});
});

/* POST Item Category - Delete */
router.post('/ItemCategory/delete', function(req, res) {
	ItemCategory.remove(req.body.del, function(err) {
		if (err) {
			req.session.error = err;
			return res.redirect('./create');
		}
	});
	if(req.body.del === undefined) {
		req.session.error = "没有选择条目";
	} else {
		req.session.success = '删除成功';
	}
	res.redirect('./create');
});

/* POST Item Category - Update */
router.post('/ItemCategory/edit/', function(req, res) {
	var itemCategory = {};
	if (req.session.edit !== null) {
		var object = req.session.edit;
		itemCategory = new ItemCategory(object._id,  req.body.code, req.body.desc,
				new Date(object.created_date), null);

		console.log("*** " + itemCategory.created_date);
	}

	itemCategory.update(function(err) {
		if (err) {
			req.session.error = "代码已经存在";
			return res.redirect('./edit/'+object._id);
		}
		req.session.success = '更新成功';
		res.redirect('./create');
	});
});

//======================================================================================

//=================================== Sub Category =====================================

//======================================================================================

/* GET Sub Category - Create. */
router.get('/SubCategory/create/:cateCode', function(req, res) {
	console.info("!!!!!1");
	req.session.category = req.params.cateCode;
	ItemCategory.getAll(function(err, itemCategories) {
		if (err) {
			itemCategories = [];
			
		}
		console.info("!!!!!2");
		if(req.params.cateCode === 'allCategory'){
			SubCategory.getAll(function(err, subCategories) {
				if (err) {
					console.info("!!!!!11");
					 subCategories = [];
					 req.session.error = "Error";
					return res.redirect('./itemManager/ItemCategory/create/allCategory');
					 
				}
				console.info("!!!!!3");
				res.render('./itemManager/SubCategory/create', {
					subCategories : subCategories,
					itemCategories :itemCategories
				});
	
			});
		} else {
			SubCategory.getByCategory(req.params.cateCode, function(err, subCategories) {
				if (err) {
					 console.info("!!!!!11");
					 subCategories = [];
					 req.session.error = "Error";
					 return res.redirect('./itemManager/ItemCategory/create/allCategory');
					 
				}
				console.info("!!!!!3");
				res.render('./itemManager/SubCategory/create', {
					subCategories : subCategories,
					itemCategories :itemCategories
				});
	
			});
		}
	});
	
});

/* GET Sub Category - Edit. */
router.get('/SubCategory/edit/:id', function(req, res) {

	SubCategory.getOne(req.params.id, function(err, subCategory) {
		if (err) {
			subCategory = null;
		}
		req.session.edit = subCategory;
		var o = req.session.edit;
		console.info("@@" + o.created_date);
		res.render('./itemManager/SubCategory/edit', {
			subCategory : subCategory,
		});

	});

});

/* POST Sub Category - Create */
router.post('/SubCategory/create', function(req, res) {
	var cat = "allCategory";
	if(req.session.category !== null){
		cat = req.session.category;
	}
	var subCategory = new SubCategory(null, req.body.code, req.body.desc, req.body.category);

	subCategory.save(function(err) {
		if (err) {
			if(!(err instanceof Object)){
				req.session.error = err;
			} else {
				req.session.error = "代码已经存在！";
			}
			res.redirect('./create/'+cat);
		} else {
		req.session.success = '新建成功';
		res.redirect('./create/'+cat);
		}
	});
});

/* POST Sub Category - Delete */
router.post('/SubCategory/delete', function(req, res) {
	
	var cat = "allCategory";
	if(req.session.category !== null){
		cat = req.session.category;
	}
	
	SubCategory.remove(req.body.del, function(err) {
		if (err) {
			req.session.error = err;
			return res.redirect('./create/'+cat);
		}
	});
	if(req.body.del === undefined) {
		req.session.error = "没有选择条目";
	} else {
		req.session.success = '删除成功';
	}
	res.redirect('./create/'+cat);
});

/* POST Sub Category - Update */
router.post('/SubCategory/edit/', function(req, res) {
	var subCategory = {};
	
	var cat = "allCategory";
	if(req.session.category !== null){
		cat = req.session.category;
	}
	
	if (req.session.edit !== null) {
		var object = req.session.edit;
		subCategory = new SubCategory(object._id,  req.body.code, req.body.desc, null, object.category,
				new Date(object.created_date), null);

		console.log("*** " + subCategory.created_date);
	}

	subCategory.update(function(err) {
		if (err) {
			req.session.error = "代码已经存在";
			return res.redirect('./edit/'+object._id);
		}
		req.session.success = '更新成功';
		res.redirect('./create/'+cat);
	});
});

/* Post Ajax Sub Category - Create. */
router.post('/SubCategory/create/ajax', function(req, res) {
	console.info("req.body.code: "+req.body.code);
	req.session.category = req.body.code;
	
		if(req.body.code === 'allCategory'){
			SubCategory.getAll(function(err, subCategories) {
				if (err) {
					console.info("!!!!!==11");
					 subCategories = [];
					 req.session.error = "Error";
					return res.redirect('./itemManager/ItemCategory/create/allCategory');
					 
				}
				console.info("!!!!!3");
				 res.contentType('json');
				 res.send( JSON.stringify(subCategories));
			});
		} else {
			SubCategory.getByCategory(req.body.code, function(err, subCategories) {
				if (err) {
					 console.info("!!!!!==22");
					 subCategories = [];
					 req.session.error = "Error";
					 return res.redirect('./itemManager/ItemCategory/create/allCategory');
					 
				}
				console.info("!!!!!3");
				 res.contentType('json');
				 res.send( JSON.stringify(subCategories));
	
			});
		}
	
});


//======================================================================================

//==================================== Brand ===========================================

//======================================================================================

/* GET Brand - Create. */
router.get('/Brand/create', function(req, res) {

	Brand.getAll(function(err, brands) {
		if (err) {
			brands = [];
		}
		res.render('./itemManager/Brand/create', {
			brands : brands
		});

	});

});

/* GET Brand - Edit. */
router.get('/Brand/edit/:id', function(req, res) {

	Brand.getOne(req.params.id, function(err, brand) {
		if (err) {
			brand = null;
		}
		req.session.edit = brand;
		var o = req.session.edit;
		console.info("@@" + o.created_date);
		res.render('./itemManager/Brand/edit', {
			brand : brand,
		});

	});

});

/* POST Brand - Create */
router.post('/Brand/create', function(req, res) {

	var brand = new Brand(null, req.body.code, req.body.desc);

	brand.save(function(err) {
		if (err) {
			req.session.error = "代码已经存在";
			return res.redirect('./create');
		}
		req.session.success = '新建成功';
		res.redirect('./create');
	});
});

/* POST Brand - Delete */
router.post('/Brand/delete', function(req, res) {
	Brand.remove(req.body.del, function(err) {
		if (err) {
			req.session.error = err;
			return res.redirect('./create');
		}
	});
	if(req.body.del === undefined) {
		req.session.error = "没有选择条目";
	} else {
		req.session.success = '删除成功';
	}
	res.redirect('./create');
});

/* POST Brand - Update */
router.post('/Brand/edit/', function(req, res) {
	var brand = {};
	if (req.session.edit !== null) {
		var object = req.session.edit;
		brand = new Brand(object._id,  req.body.code, req.body.desc,
				new Date(object.created_date), null);

		console.log("*** " + brand.created_date);
	}

	brand.update(function(err) {
		if (err) {
			req.session.error = "代码已经存在";
			return res.redirect('./edit/'+object._id);
		}
		req.session.success = '更新成功';
		res.redirect('./create');
	});
});

//======================================================================================

//==================================== Product =========================================

//======================================================================================

router.get('/Product/create', function (req, res) {
	
	
	ItemCategory.getAll(function(err, itemCategories) {
		
		if (err) {
			itemCategories = [];
			 req.session.error = "Error";
			return res.redirect('./itemManager/Product/view');
		}
		if(itemCategories.length > 0){
			console.log("DDD" +itemCategories[0].code);
		SubCategory.getByCategory(itemCategories[0].code, function(err, subCategories) {
			if (err) {
				 subCategories = [];
				 req.session.error = "Error";
				return res.redirect('./itemManager/Product/view');
			}
			
			Brand.getAll(function(err, brands) {
				if (err) {
					brands = [];
					 req.session.error = "Error";
					return res.redirect('./itemManager/Product/view');
				}
				
				 
				res.render('./itemManager/Product/create', {
					itemCategories : itemCategories,
					subCategories : subCategories,
					brands : brands
				});
			});
		});
		}
	});
});

router.post('/Product/save', function (req, res) {
	console.log(req.body.size+" "+req.body.code+" "+req.body.select2);
	var sizes = [];
	var length = req.body.size.length;
	
	if(req.body.size.constructor === Array){
		console.log("here david");
		for(var i = 0; i<length ;i++){
			if(req.body.size[i]==="" && req.body.cost[i]==="" && req.body.comment[i]===""){
				continue;
			}
			if(req.body.size[i]==="" && (req.body.cost[i]!=="" || req.body.comment[i]!=="")){
				req.session.error = "请输入规格";
				 return res.redirect('./create');
			}
			var size = {};
			size.size =req.body.size[i];
			size.cost = req.body.cost[i];
			size.comment = req.body.comment[i];
			size.created_date = new Date();
			size.last_update_date = new Date();
			sizes.push(size);
		}
	} else {
		console.log("here david2");
		var size2 = {};
		size2.size =req.body.size;
		size2.cost = req.body.cost;
		size2.comment = req.body.comment;
		size2.created_date = new Date();
		size2.last_update_date = new Date();
		sizes.push(size2);
	}
	var product={};
	if(sizes.length >=1){
	product = new Product(null, req.body.code, null,null, req.body.pname, sizes, req.body.select2, req.body.select3);
	} else {
		req.session.error = "未知错误";
		 return res.redirect('./create');
	}
	
	product.save(function(err) {
		if (err) {
			req.session.error = "代码已经存在";
			return res.redirect('./create');
		}
		req.session.success = '新建成功';
		res.redirect('./create');
	});
	
});

router.post('/Product/ajax', function (req, res) {
	
	SubCategory.getByCategory(req.body.code, function(err, subCategories) {
		if (err) {
			 console.info("!!!!!==22");
			 subCategories = [];
			 req.session.error = "Error";
			 return res.redirect('./itemManager/Product/create');
			 
		}
		 console.info("!!!!!3");
		 res.contentType('json');
		 res.send( JSON.stringify(subCategories));

	});
});

router.get('/Product/view', function (req, res) {
	
	var criteria = {};
	ItemCategory.getAll(function(err, itemCategories) {
		
		if (err) {
			itemCategories = [];
			 req.session.error = "Error";
			return res.redirect('./itemManager/Product/view');
		}
		if(itemCategories.length > 0){
			console.log("DDD" +itemCategories[0].code);
		SubCategory.getByCategory(itemCategories[0].code, function(err, subCategories) {
			if (err) {
				 subCategories = [];
				 req.session.error = "Error";
				return res.redirect('./itemManager/Product/view');
			}
			
			Brand.getAll(function(err, brands) {
				if (err) {
					brands = [];
					 req.session.error = "Error";
					return res.redirect('./itemManager/Product/view');
				}
				Product.getByCriteria(criteria, function(err,products){
					if (err) {
						products = [];
						req.session.error = "Error";
						return res.redirect('./itemManager/Product/view');
					}
				
					res.render('./itemManager/Product/view', {
						itemCategories : itemCategories,
						subCategories : subCategories,
						brands : brands,
						products : products
					});
				});
				 
				
			});
		});
		}
	});
});


router.post('/Product/search', function (req, res) {
	
	
	console.info("info:"+req.body.category+" "+req.body.subcategory+" "+req.body.brand);
	
	var criteria ={};
	
	if(req.body.category !== 'all'){
		
		criteria["sub_category.category.code"] = req.body.category;
	}
	
	if(req.body.subcategory !== 'all'){
		criteria["sub_category.code"] = req.body.subcategory;
	}
	
	if(req.body.brand !== 'all'){
		criteria["brand.code"] = req.body.brand;
	}
	
	console.info(JSON.stringify(criteria, null, 4));
	
	Product.getByCriteria(criteria, function(err,products){
		if (err) {
			 console.info("!!!!!==22");
			 products = [];
			 req.session.error = "Error";
			 return res.redirect('./itemManager/Product/view');
			 
		}
		 console.info("!!!!!3");
		 res.contentType('json');
		 res.send( JSON.stringify(products));

	});
});


/* POST Product - Delete */
router.post('/Product/delete', function(req, res) {
	Product.remove(req.body.del, function(err) {
		if (err) {
			req.session.error = err;
			return res.redirect('./view');
		}
	});
	if(req.body.del === undefined) {
		req.session.error = "没有选择条目";
	} else {
		req.session.success = '删除成功';
	}
	res.redirect('./view');
});


router.get('/Product/edit/:id', function (req, res) {
	
	
	ItemCategory.getAll(function(err, itemCategories) {
		
		if (err) {
			itemCategories = [];
			 req.session.error = "Error";
			return res.redirect('./itemManager/Product/view');
		}
		if(itemCategories.length > 0){
			console.log("DDD" +itemCategories[0].code);
		SubCategory.getByCategory(itemCategories[0].code, function(err, subCategories) {
			if (err) {
				 subCategories = [];
				 req.session.error = "Error";
				return res.redirect('./itemManager/Product/view');
			}
			
			Brand.getAll(function(err, brands) {
				if (err) {
					brands = [];
					 req.session.error = "Error";
					return res.redirect('./itemManager/Product/view');
				}
				
				Product.getOne(req.params.id, function(err,product){
					if (err) {
						product = null;
					}
					req.session.edit = product;
					console.log("!!!!"+ JSON.stringify(product));
					res.render('./itemManager/Product/edit', {
						itemCategories : itemCategories,
						subCategories : subCategories,
						brands : brands,
						product: product
					});
				});
				
				
			});
		});
		}
	});
});


/* POST Product - Update */
router.post('/Product/edit/', function(req, res) {
	var product = {};
	var sizes = [];
	var length = req.body.size.length;
	
	if(req.body.size.constructor === Array){
		console.log("here david");
		for(var i = 0; i<length ;i++){
			if(req.body.size[i]==="" && req.body.cost[i]==="" && req.body.comment[i]===""){
				continue;
			}
			if(req.body.size[i]==="" && (req.body.cost[i]!=="" || req.body.comment[i]!=="")){
				req.session.error = "请输入规格";
				 return res.redirect('./create');
			}
			var size = {};
			size.size =req.body.size[i];
			size.cost = req.body.cost[i];
			size.comment = req.body.comment[i];
			size.created_date = new Date();
			size.last_update_date = new Date();
			sizes.push(size);
		}
	} else {
		console.log("here david2");
		var size2 = {};
		size2.size =req.body.size;
		size2.cost = req.body.cost;
		size2.comment = req.body.comment;
		size2.created_date = new Date();
		size2.last_update_date = new Date();
		sizes.push(size2);
	}
	
	if (req.session.edit !== null) {
		var object = req.session.edit;
		product = new Product(object._id, req.body.code, null,null, req.body.pname, sizes, req.body.select2, req.body.select3);

	}

	product.update(function(err) {
		if (err) {
			req.session.error = "代码已经存在";
			return res.redirect('./edit/'+object._id);
		}
		req.session.success = '更新成功';
		res.redirect('./view');
	});
});
