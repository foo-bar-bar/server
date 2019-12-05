const router = require('express').Router()
const profile = require('./profileRoute')
const user = require('./userRoute')



router.use('/user', user)
router.use('/profile', profile)




module.exports = router