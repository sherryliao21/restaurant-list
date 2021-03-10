const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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


