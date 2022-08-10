var FacebookStrategy = require('passport-Facebook').Strategy;
var User = require('../models/user');
var session = require('express-session');

module.exports = function(app, passport) {


    app.use(passport.initialize());
    app.use(passport.session());

    app.use(session({ secret: 'keyboard cat', resave: false, saveUnitialized: true, cookie: { secure: false } }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    })
    passport.use(new FacebookStrategy({
            clientID: "3463404367008654",
            clientSecret: "23350851a1cd81a54b9b386192b1799f",
            callbackURL: "http://localhost:8080/auth/facebook/callback",
            profileFields: ['id', 'displayname', 'photos', 'email']
        },
        function(accessToken, refreshToken, profile, done) {
        	console.log(profile);
            /*User.findOrCreate({ facebookId: profile.id }, function(err, user) {
                return cb(err, user);
            });*/
            done(null, profile);
        }
    ));
    console.log("testing Facebook");
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }));
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    return passport;
}