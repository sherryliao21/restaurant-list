const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
const mongoose = require('mongoose')
const db = mongoose.connection
const methodOverride = require('method-override')
const routes = require('./routes')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, (req, res) => {
  console.log(`Express is listening on localhost:${port}`)
})