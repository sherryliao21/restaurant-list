const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // initialize
  app.use(passport.initialize())
  app.use(passport.session())
  // strategy settings
  passport.use(new LocalStrategy({
    usernameField: 'email' // instead of the default username identification, we are using email to identify the user
  }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false, { message: 'This user is not registered!' })
        if (user.password !== password) {
          return done(null, false, { message: 'Email or password is incorrect!' })
        }
        return done(null, user)
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


