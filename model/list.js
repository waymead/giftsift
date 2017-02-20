const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
	name: String,
	type: String,
	notes: String,
	created: {
		type: Date,
		default: Date.now()
	},
	gifts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Gift'
	}],
	members: [String],
	owner: String,
	ownerName: String,
	deleted: { type: Boolean, default: false}
}, { collection: 'lists' });

listSchema.statics.findById = function(id) {
	return this.findOne({ _id: id, deleted: {$ne: true} }, {}, { sort: 'name' });
};

listSchema.statics.findByIdAndOwner = function(id, email) {
	return this.findOne({ _id: id, members: email, deleted: {$ne: true} }, {}, { sort: 'name' });
};

listSchema.statics.findByOwner = function(email) {
	return this.find({ owner: email, deleted: {$ne: true} }, {}, { sort: 'name' });
};

listSchema.statics.findByMember = function(email) {
	return this.find({ members: email, deleted: {$ne: true} }, {}, { sort: 'name' });
};

listSchema.statics.delete = function(id, email) {
	return this.findOneAndUpdate({ _id: id, owner: email }, { $set: {deleted: true }});
};

listSchema.statics.undelete = function(id, email) {
	return List.findOneAndUpdate({ _id: id, owner: email }, { $set: {deleted: false }});
};

listSchema.statics.join = function(id, email) {
	return this.findOneAndUpdate({ _id: id }, { $addToSet: { members: email } });
};

listSchema.statics.leave = function(id, email) {
	return this.findOneAndUpdate({ _id: id }, { $pull: { members: email } });
};

listSchema.methods.isOwner = function (email) {
	return this.owner == email;
};

listSchema.methods.isMember = function (email) {
	return this.members.indexOf(email) > -1;
};

const List = mongoose.model('List', listSchema);

module.exports = List;