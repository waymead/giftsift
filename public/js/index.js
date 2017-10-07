var lock = new Auth0Lock(
	'gke8dvNOd9zCObbyjHMu95SfFPnljmh4',
	'giftsift.eu.auth0.com'
);

lock.on('authenticated', function(authResult) {
	lock.getUserInfo(authResult.accessToken, function(error, profile) {
		if (error) {
			// Handle error
			return;
		}
		localStorage.setItem('accessToken', authResult.accessToken);
		localStorage.setItem('profile', JSON.stringify(profile));

		// Update DOM
	});
});

var router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/public',
			component: null
		},
		{
			path: '/private',
			component: null
		}
	]
});

var app = new Vue({
	el: '#app',
	router: router,
	data: {
		message: 'Hello Vue!',
		authenticated: false,
		secretThing: '',
		lock: new Auth0Lock(
			'gke8dvNOd9zCObbyjHMu95SfFPnljmh4',
			'giftsift.eu.auth0.com'
		)
	},
	mounted() {
		var self = this;
		Vue.nextTick(function() {
			self.authenticated = checkAuth();
			self.lock.on('authenticated', authResult => {
				console.log('authenticated');
				localStorage.setItem('id_token', authResult.idToken);
				self.lock.getProfile(authResult.idToken, (error, profile) => {
					if (error) {
						// Handle error
						return;
					}
					// Set the token and user profile in local storage
					localStorage.setItem('profile', JSON.stringify(profile));

					self.authenticated = true;
				});
			});
			self.lock.on('authorization_error', error => {
				// handle error when authorizaton fails
			});
		});
	},
	events: {
		logout: function() {
			this.logout();
		}
	},
	methods: {
		login() {
			this.lock.show();
		}
	}
});

function checkAuth() {
	return !!localStorage.getItem('id_token');
}
