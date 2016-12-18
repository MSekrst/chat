import passport from 'passport';
import hash from 'password-hash';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import { getDb } from '../mongo';

passport.use(new LocalStrategy((username, password, next)  => {
  const db = getDb();

  const userPromise = db.collection('users').findOne({ username });

  // handle promise
  userPromise.then(user => {
    if (!user) {
      return next(null);
    }

    if (hash.verify(password, user.password)) {
      return next(null, user);
    }

    return next(null);

  }).catch(err => {
    return next(err);
  });
}));

const facebook_id = process.env.FACEBOOK_ID || '1518656061483301';
const facebook_secret = process.env.FACEBOOK_SECRET || 'a8dda501bd0147a529acee24c90d1d43';
const facebook_callback = process.env.FACEBOOK_CALLBACK || 'https://localhost:3000/api/auth/facebook/callback';

const options = {
  clientID: facebook_id,
  clientSecret: facebook_secret,
  callbackURL: facebook_callback,
  profileFields: ['displayName', 'id', 'photos', 'email'],
};

passport.use(new FacebookStrategy(options, (accessToken, refreshToken, profile, next) => {
  process.nextTick(() => {
    const db = getDb();

    const newUser = {
      username: profile.displayName,
      facebook: {
        id: profile.id,
        token: accessToken,
      }
    };

    // inserts new user or returns existing user -> upsert
    db.collection('users').findOneAndUpdate({ username : newUser.username }, newUser,
      { upsert: true }, (err, user) => {
      if (err) {
        return next(err);
      }

      // set found user or new user if insert is done
      const active = (user || user.active) ? newUser : user.active;

      return next(null, active);
    });
  });
}));

export default passport;
