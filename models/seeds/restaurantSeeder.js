const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurants.json')

db.once('open', () => {
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