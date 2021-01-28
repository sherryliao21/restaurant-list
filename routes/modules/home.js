const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ name: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const sort = req.query.sort
  const defaultSort = sort === 'A-Z'
  if (sort === 'category') {
    return Restaurant.find()
      .lean()
      .sort({ category: 'asc' })
      .then(restaurants => res.render('index', { restaurants, keyword }))
      .catch(error => console.log(error))
  } else if (sort === 'location') {
    return Restaurant.find()
      .lean()
      .sort({ location: 'asc' })
      .then(restaurants => res.render('index', { restaurants, keyword }))
      .catch(error => console.log(error))
  } else if (defaultSort) {
    return Restaurant.find()
      .lean()
      .sort({ name: 'asc' })
      .then(restaurants => res.render('index', { restaurants, keyword }))
      .catch(error => console.log(error))
  } else if (sort === 'Z-A') {
    return Restaurant.find()
      .lean()
      .sort({ name: 'desc' })
      .then(restaurants => res.render('index', { restaurants, keyword }))
      .catch(error => console.log(error))
  } else {
    return Restaurant.find({
      "$or":
        [{
          "name": { $regex: `${keyword}`, $options: '$i' }
        }]
    }).lean()
      .then(restaurants => res.render('index', { restaurants, keyword }))
      .catch(error => console.log(error))
  }
})


module.exports = router