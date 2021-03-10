const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

router.use('/', home)
router.use('/restaurants', restaurants)
router.use('/users', users)

module.exports = router