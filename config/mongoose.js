const mongoose = require('mongoose')

// mongoose.connect(process.env.URL_DB, {
mongoose.connect(process.env.URL_DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) console.log(`Failed connect to database`)
  else console.log(`Success connect to database`)
})

module.exports = mongoose