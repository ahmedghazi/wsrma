var LocalPassport = function(app) {
    var LocalStrategy = require('passport-local').Strategy;
    var passport = require('passport');

    passport.serializeUser(function(user, done) {
        console.log('Serializing User Ok'.yellow, user.email.grey);
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        app.getModel('User').findOne({_id: id}, function(err, user) {
            console.log('Deserialize User Ok'.yellow, user.email.grey);
            done(err, user);
        });
    });
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done) {
        console.log('Authentification Request LocalStrategy'.yellow, email.grey);
        var userReq = {email: email, password: password};
        app.getModel('User').findOne(userReq, function(err, user) {
            if (err) {
                console.error(err);
                return done(err);
            }
            if (!user) {
                console.error('User not found', email.grey);
                return done(null, false, {message: 'User not found'});
            }
            console.log('Authentification'.yellow, 'Success'.green, user.email.grey);
            return done(null, user);
        });
    }));
    return passport;
};
module.exports = LocalPassport;