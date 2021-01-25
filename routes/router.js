const express = require('express')
const restaurant = require('../models/restaurant')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const port = 3000

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

router.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find({
    "$or":
      [{
        "name": { $regex: `${keyword}`, $options: '$i' }
      }]
  }).lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})
router.post('/restaurants', (req, res) => {
  const { name, category, image, location, phone, rating, description } = req.body
  return Restaurant.create({ name, category, image, location, phone, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  const { name, category, image, location, phone, rating, description } = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      const { name, category, image, location, phone, rating, description } = restaurant
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

router.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router