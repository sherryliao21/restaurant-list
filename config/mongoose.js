const mongoose = require('mongoose')
const db = mongoose.connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/restaurant-list'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

module.exports = db