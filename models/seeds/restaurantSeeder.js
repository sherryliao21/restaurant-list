const mongoose = require('mongoose')
const db = mongoose.connection
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurants.json')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', () => {
  console.error('error')
})
db.once('open', () => {
  console.log('MongoDB connected!')
  restaurantList.results.forEach((item) => {
    Restaurant.create({
      name: item.name,
      category: item.category,
      image: item.image,
      location: item.location,
      phone: item.phone,
      rating: item.rating,
      description: item.description
    })
  })
  console.log('done creating seed data')
})