var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = new Schema({
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
	ownerName: String
}, { collection: 'lists' });

var List = mongoose.model('List', listSchema);

var giftSchema = new Schema({
	name: String,
	url: String,
	image: String,
	type: String,
	notes: String,
	list: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	},
	created: {
		type: Date,
		default: Date.now()
	},
	owner: String,
	ownerName: String,
	boughtBy: String
}, { collection: 'gifts' });

var Gift = mongoose.model('Gift', giftSchema);

module.exports = { List: List, Gift: Gift };
