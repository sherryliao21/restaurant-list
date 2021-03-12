const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../restaurants.json')
const User = require('../user')

const SEED_USERS = [{
  email: 'user1@example.com',
  password: '12345678'
}, {
  email: 'user2@example.com',
  password: '12345678'
}]

db.once('open', () => {
  SEED_USERS.forEach((user, index) => {  // The callback in forEach accepts 3 parameters (item, index, array)
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash =>
        User.create({
          email: user.email,
          password: hash
        }))
      .then(userSeed => {
        const userId = userSeed._id
        const restaurantItem = restaurantList.results
        return Promise.all(
          Array.from({ length: 3 }, (_, i) =>
            Restaurant.create({
              name: restaurantItem[(i + (index * 3))].name,
              category: restaurantItem[(i + (index * 3))].category,
              image: restaurantItem[(i + (index * 3))].image,
              location: restaurantItem[(i + (index * 3))].location,
              phone: restaurantItem[(i + (index * 3))].phone,
              rating: restaurantItem[(i + (index * 3))].rating,
              description: restaurantItem[(i + (index * 3))].description,
              userId
            })
          ))
      })
      .then(() => {
        console.log('done creating seed data')
        process.exit()
      })
      .catch(err => console.log(err))
  })
})