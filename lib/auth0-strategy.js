var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var User = require('../model').User;

var strategy = new Auth0Strategy({
	domain: process.env.AUTH0_DOMAIN,
	clientID: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	callbackURL: process.env.AUTH0_CALLBACK_URL
}, (accessToken, refreshToken, extraParams, profile, done) => {
	let user = {
		email: profile.emails[0].value,
		displayName: profile.displayName,
		picture: profile.picture
	};
	User.findOneAndUpdate({ email: user.email }, user, { upsert: true, new: true })
		.then((newUser) => {
			return done(null, newUser);
		});
});

passport.use(strategy);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

module.exports = strategy;