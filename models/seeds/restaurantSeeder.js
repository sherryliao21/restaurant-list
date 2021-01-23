const mongoose = require('mongoose')
const Restaurant = require('../restaurant')

const restaurantList = require('../../restaurants.json')

// connect database
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.error('error')
})
db.once('open', () => {
  console.log('MongoDB connected!')
  // create seed data
  restaurantList.results.forEach((item) => {
    Restaurant.create({
      id: item.id,
      name: item.name,
      category: item.category,
      image: item.image,
      location: item.location,
      phone: item.phone,
      google_map: item.google_map,
      rating: item.rating,
      description: item.description
    })
  })
  console.log('done creating seed data')
})