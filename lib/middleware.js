const logger = require('../lib/logging.js');

const errorHandler = async (ctx, next) => {
	try {
		await next();
		if (ctx.status === 404) {
			ctx.throw(404, 'Not found');
		}
	} catch (err) {
		logger.log(err);
		ctx.status = 400;
		ctx.app.emit('error', err, ctx);
		return ctx.render('error', { message: err });
	}
};

module.exports = {errorHandler: errorHandler};