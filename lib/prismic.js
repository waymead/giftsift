const prismic = require('prismic-nodejs');
const logger = require('../lib/logging.js');

module.exports = (req, res, next) => {
	prismic.api(process.env.PRISMIC_API_URL, {
		accessToken: process.env.PRISMIC_API_TOKEN,
		req
	})
	.then(api => {
		req.prismic = {
			api
		};
		next();
	}).catch(err => {
		logger.error(err);
		return next(err);
	});
};
