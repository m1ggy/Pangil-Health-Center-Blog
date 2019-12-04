const LocalStrategy = require('passport-local').Strategy


function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    const user = getUserByUsername(username)
    if (user == null) {
      console.log('cant login')
      return done(null, false)
    }

    try {
      if (password == user.password) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.admin))
  passport.deserializeUser((admin, done) => {
    return done(null, getUserById(admin))
  })
}

module.exports = initialize