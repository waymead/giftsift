const logger = require('../lib/logging.js');
const mongoose = require('../model').Mongoose;
const List = require('../model').List;
const Gift = require('../model').Gift;

module.exports = {
	getLists: (email) => {
		return new Promise( function (resolve, reject) {
			List.findByMember(email)
				.then(function(lists) {
					resolve(lists);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	getList: (id, email) => {
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
	createList: (list) => {
		return new Promise( function (resolve, reject) {
			list = new List(list);
			list.id = new mongoose.Types.ObjectId;
			list.save()
				.then(function(newList) {
					resolve(newList);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	saveList: (list) => {
		return new Promise( function (resolve, reject) {
			List.findOneAndUpdate({ _id: list.id}, list, { new: true })
				.then(function(newList) {
					resolve(newList);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	deleteList: (id, email) => {
		return new Promise( function (resolve, reject) {
			List.delete(id, email)
				.then(function(newList) {
					resolve(newList);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	undeleteList: (id, email) => {
		return new Promise( function (resolve, reject) {
			List.undelete(id, email)
				.then(function(newList) {
					resolve(newList);
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