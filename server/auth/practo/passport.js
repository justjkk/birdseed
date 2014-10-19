exports.setup = function (User, config) {
  var passport = require('passport');
  var OpenIDStrategy = require('passport-openid').Strategy;

  passport.use(new OpenIDStrategy({
    returnURL: 'http://localhost:8080/auth/practo/callback',
    realm: 'http://localhost:8080',
    providerURL: config.practo.openIDURL,
    profile: true,
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({
      'twitter.id_str': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'twitter',
          twitter: profile._json
        });
        user.save(function(err) {
          if (err) return done(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
    }
  ));
};
