var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({
	domain: process.env.AUTH0_DOMAIN,
	clientID: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	callbackURL: process.env.AUTH0_CALLBACK_URL
}, (accessToken, refreshToken, extraParams, profile, done) => {
	return done(null, profile);
});

passport.use(strategy);

passport.serializeUser((user, done) => {
	done(null, user._json);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

module.exports = strategy;