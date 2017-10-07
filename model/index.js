const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('./user.js');
const List = require('./list.js');
const Gift = require('./gift.js');

mongoose.connect(process.env.MONGO_URL, {
	autoReconnect: true,
	useMongoClient: true,
	promiseLibrary: global.Promise
});

module.exports = { User: User, List: List, Gift: Gift, mongoose: mongoose };
