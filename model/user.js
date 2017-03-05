const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	email: String,
	displayName: String,
	picture: String
}, { collection: 'users' });

schema.statics.findById = function(id) {
	return this.findOne({ _id: id }, {}, { sort: 'name' });
};

module.exports = mongoose.model('User', schema);