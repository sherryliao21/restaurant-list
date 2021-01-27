const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
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

module.exports = router