const logger = require('../lib/logging.js');
require('../model');
const List = require('../model/aiwf.js').List;
const Gift = require('../model/aiwf.js').Gift;

module.exports = {
	getLists: (email) => {
		return new Promise( function (resolve, reject) {
			List.find({ members: email }, {}, { sort: 'name' })
				.then(function(lists) {
					resolve(lists);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	getListById: (id, email) => {
		return new Promise( function (resolve, reject) {
			List.findOne({ _id: id, members: email }, {}, { sort: 'name' })
				.then(function(list) {
					resolve(list);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	getGiftById: (id) => {
		return new Promise( function (resolve, reject) {
			Gift.findOne({ _id: id }, {}, { sort: 'name' })
				.then(function(gift) {
					resolve(gift);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	}
};