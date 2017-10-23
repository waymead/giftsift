const logger = require('../lib/logging.js');

function errorHandler() {
	return async function errorHandler (ctx, next) {
		try {
			await next();
			if (ctx.status === 404) {
				ctx.throw(404, 'Not found');
			}
		} catch (err) {
			logger.error(err);
			ctx.status = 400;
			ctx.app.emit('error', err, ctx);
			return ctx.render('error', { message: err });
		}
	};
}
module.exports = {errorHandler: errorHandler};