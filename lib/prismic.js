const Prismic = require('prismic-javascript');
const logger = require('../lib/logging.js');

module.exports = async (ctx, next) => {
	try {
		const api = await Prismic.getApi(
			process.env.PRISMIC_API_URL,
			{
				accessToken: process.env.PRISMIC_API_TOKEN,
				req: ctx.req
			}
		);
		ctx.state.prismicApi = api;
	} catch (error) {
		logger.error(error);
		return next(error);
	}
};
