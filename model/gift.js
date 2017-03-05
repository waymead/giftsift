const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giftSchema = new Schema({
	name: String,
	url: String,
	image: String,
	type: String,
	notes: String,
	lists: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	}],
	created: {
		type: Date,
		default: Date.now()
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	boughtBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	deleted: {
		type: Boolean,
		default: false
	}
}, { collection: 'gifts' });

giftSchema.statics.findByIdAndOwner = function(id, user) {
	return this.findOne({ _id: id, owner: user })
		.populate('lists', 'name', null, { sort: 'name' })
		.exec();
};

giftSchema.statics.findByListId = function(id) {
	return this.find({ lists: id, deleted: { $ne: true } })
		.populate('owner', 'displayName', null, { sort: 'displayName' });
};

giftSchema.statics.delete = function(id, user) {
	return this.findOneAndUpdate({ _id: id, owner: user }, { $set: {deleted: true }});
};

giftSchema.statics.undelete = function(id, user) {
	return this.findOneAndUpdate({ _id: id, owner: user }, { $set: {deleted: false }});
};

giftSchema.statics.buy = function(id, user) {
	return this.findOneAndUpdate({ _id: id, boughtBy: null }, { $set: {boughtBy: user }});
};

giftSchema.statics.replace = function(id, user) {
	return this.findOneAndUpdate({ _id: id, boughtBy: user }, { $unset: {boughtBy: true }});
};

giftSchema.methods.isOwner = function (user) {
	return this.owner.equals(user._id);
};

giftSchema.methods.isBought = function () {
	return this.boughtBy;
};

giftSchema.methods.isBoughtBy = function (user) {
	return this.boughtBy && this.boughtBy.equals(user._id);
};

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;