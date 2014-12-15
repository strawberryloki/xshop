/**
 * New node file
 */
var MongoClient = require('mongodb').MongoClient;
var settings = require('../../settings');

function ItemCategory(code, desc, created_date) {
	this.code = code;
	this.desc = desc;
	if (created_date) {
		this.created_date = created_date;
	}
	this.last_updated_date = new Date();
}

module.exports = ItemCategory;

ItemCategory.prototype.save = function save(callback) {
	
	var itemCategory = {
			code : this.code,
			desc : this.desc ,
			created_date : this.created_date ,
			last_updated_date : this.last_updated_date 
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
			
			collection.insert(itemCategory, function(err, itemCategory) {

				callback(err, itemCategory);

				db.close(function(err, itemCategory) {
					console.log('Error2:' + err);
				});
			});

		});
	});
};

