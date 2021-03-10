module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) { // if the user is authenticated then continue
      return next()
    }
    res.redirect('/users/login') //  if not, redirect to login page
  }
}