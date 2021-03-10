const express = require('express')
const router = express.Router()

const user = require('./modules/user')
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

router.use('/', home)
router.use('/restaurants', restaurants)
router.use('/users', user)

module.exports = router