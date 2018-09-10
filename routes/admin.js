var logger = require('../lib/logging.js');
var List = require('../model').List;
var Gift = require('../model').Gift;

const Router = require('koa-router');
const router = new Router({
  prefix: '/admin'
});

router.use(async (ctx, next) => {
  if (ctx.isUnauthenticated()) {
    return ctx.redirect('/auth/login');
  }
  return next();
});

router.get('/', async (ctx, next) => {
  try {
    var lists = await List.find({}, {}, { sort: 'name' });
    var gifts = await Gift.find({}, {}, { sort: 'name' });
    return ctx.render('admin/index', { lists: lists, gifts: gifts });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
});

router.get('/lists', async (ctx, next) => {
  try {
    var lists = await List.find({}, {}, { sort: 'name' });
    return ctx.render('admin/lists', { lists: lists });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
});

module.exports = router;
