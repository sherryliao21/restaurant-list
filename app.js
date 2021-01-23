// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

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
// set body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// import Restaurant model
const Restaurant = require('./models/restaurant')

// setting static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  // res.render('index', { restaurants: restaurantList.results })
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/new', (req, res) => {
  return res.render('new')
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.post('/restaurants', (req, res) => {
  //const id = req.body.id
  const name = req.body.name
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.create({ name, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, (req, res) => {
  console.log(`Express is listening on localhost:${port}`)
}) 