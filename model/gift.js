const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giftSchema = new Schema({
	name: String,
	url: String,
	image: String,
	type: String,
	notes: String,
	list: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	}],
	lists: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	}],
	created: {
		type: Date,
		default: Date.now()
	},
	owner: String,
	ownerName: String,
	boughtBy: String,
	deleted: { type: Boolean, default: false}
}, { collection: 'gifts' });

giftSchema.statics.findByIdAndOwner = function(id, email) {
	return this.findOne({ _id: id, owner: email})
		.populate('list', 'name', null, { sort: 'name' })
		.exec();
};

giftSchema.statics.delete = function(id, email) {
	return Gift.findOneAndUpdate({ _id: id, owner: email }, { $set: {deleted: true }});
};

giftSchema.statics.undelete = function(id, email) {
	return Gift.findOneAndUpdate({ _id: id, owner: email }, { $set: {deleted: false }});
};

giftSchema.methods.isOwner = function (email) {
	return this.owner == email;
};

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;