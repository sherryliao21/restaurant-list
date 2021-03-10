const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // initialize
  app.use(passport.initialize())
  app.use(passport.session())
  // strategy settings
  passport.use(new LocalStrategy({
    usernameField: 'email', // instead of the default username identification, we are using email to identify the user
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('warning_msg', '此信箱未註冊，請重新輸入！')
          return done(null, false)
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              req.flash('warning_msg', '信箱或密碼不正確，請重新輸入！')
              return done(null, false)
            }
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    // because password is required, so we gotta generate & bcrypt a password for the FB login users
    const { email, name } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user) // pass on user data
        const randomPassword = Math.random().toString(36).slice(-8) // give em a random password
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => {
            User.create({
              name,
              email,
              password: hash
            })
          })
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))
  // serialize/deserialize to save data storing space
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user)) // pass user
      .catch(err => done(err, null)) // pass error, null means no user is passed
  })
}


