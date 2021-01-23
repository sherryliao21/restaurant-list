// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

// setting template engine
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurants.json')
app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // second parameter tells the template engine that we are gonna use the file 'main' as the default layout
app.set('view engine', 'handlebars') // tells Express that we are setting 'handlebars' as our 'view engine'

// setting static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.listen(port, (req, res) => {
  console.log(`Express is listening on localhost:${port}`)
}) 