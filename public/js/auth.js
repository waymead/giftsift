/* eslint-env jquery */
/* global Auth0Lock */

var lock = new Auth0Lock(document.getElementById('clientId').innerHTML, document.getElementById('domain').innerHTML, {
	auth: {
		redirectUrl: document.getElementById('callbackUrl').innerHTML,
		sso: true,
		responseType: 'code',
		params: {
			scope: 'openid name email picture'
		}
	},
	rememberLastLogin: true,
	theme: {
		logo: '/images/logo.png',
		primaryColor: '#ff5722'
	},
	languageDictionary: {
		title: 'GiftSift'
	},
	socialButtonStyle: 'big',
	closable: false
});
window.onload = lock.show();
