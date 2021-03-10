const express = require('express')
const app = express()
const PORT = 3000

const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
require('./config/mongoose')
const methodOverride = require('method-override')
const routes = require('./routes')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(PORT, (req, res) => {
  console.log(`Express is listening on localhost:${PORT}`)
})