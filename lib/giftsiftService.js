const logger = require('../lib/logging.js');
const mongoose = require('../model').Mongoose;
const List = require('../model').List;
const Gift = require('../model').Gift;

module.exports = {
	getListsByMember: (email) => {
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
	getListById: (id) => {
		return new Promise( function (resolve, reject) {
			List.findById(id)
				.then(function(list) {
					resolve(list);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	getListByIdAndOwner: (id, email) => {
		return new Promise( function (resolve, reject) {
			List.findByIdAndOwner(id, email)
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
	joinList: (id, email) => {
		return new Promise( function (resolve, reject) {
			List.join(id, email)
				.then(function(newList) {
					resolve(newList);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	leaveList: (id, email) => {
		return new Promise( function (resolve, reject) {
			List.leave(id, email)
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
	},
	getGiftByIdAndOwner: (id, email) => {
		return new Promise( function (resolve, reject) {
			Gift.findByIdAndOwner(id, email)
				.then(function(gift) {
					resolve(gift);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	getGiftsByListId: (id) => {
		return new Promise( function (resolve, reject) {
			Gift.findByListId(id)
				.then(function(gifts) {
					resolve(gifts);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	createGift: (gift) => {
		return new Promise( function (resolve, reject) {
			gift = new Gift(gift);
			gift.id = new mongoose.Types.ObjectId;
			gift.save()
				.then(function(newGift) {
					resolve(newGift);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	saveGift: (gift) => {
		return new Promise( function (resolve, reject) {
			Gift.findOneAndUpdate({ _id: gift.id}, gift, { new: true })
				.then(function(newGift) {
					resolve(newGift);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	deleteGift: (id, email) => {
		return new Promise( function (resolve, reject) {
			Gift.delete(id, email)
				.then(function(gift) {
					resolve(gift);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	undeleteGift: (id, email) => {
		return new Promise( function (resolve, reject) {
			Gift.undelete(id, email)
				.then(function(gift) {
					resolve(gift);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	buyGift: (id, email) => {
		return new Promise( function (resolve, reject) {
			Gift.buy(id, email)
				.then(function(gift) {
					resolve(gift);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	},
	replaceGift: (id, email) => {
		return new Promise( function (resolve, reject) {
			Gift.replace(id, email)
				.then(function(gift) {
					resolve(gift);
				}).catch(function(err) {
					logger.error(err);
					reject(err);
				});
		});
	}
};