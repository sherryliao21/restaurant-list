const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const PORT = process.env.PORT

// view engine settings
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// session settings
app.use(session({
  secret: process.env.SESSION_SECRET, // session 用來驗證 session id 的字串
  resave: false, // 每一次與使用者互動後，不會強制把 session 更新到 session store 裡
  saveUninitialized: true // 每一次與使用者互動後，強制把 session 更新到 session store 裡
}))

// middleware settings
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
// add a middleware that stores the commonly-used local variables { isAuthenticated, user } for templates to use
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.use(routes)

app.listen(PORT, (req, res) => {
  console.log(`Express is listening on localhost:${PORT}`)
})

