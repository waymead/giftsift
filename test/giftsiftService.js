/* eslint-env node, mocha */
//const assert = require('assert');
require('dotenv').config({
	silent: true,
	path: '\.env'
});

/*const giftsiftService = require('../lib/giftsiftService.js');

describe('Giftsift Service tests', function () {
	describe('constructor', function () {
		it('service should exist', function () {
			assert(giftsiftService != null);
		});
	});
	describe('getLists()', function () {
		it('should return an empty list of Lists', function () {
			return giftsiftService.getListsByMember('unknow.user')
				.then(function(list) {
					assert(list != null);
					assert(list.length == 0);
				});
		});
	});
});*/
