const router = require('express').Router()
const profile = require('./profileRoute')


router.use('/user', user)
router.use('/profile', profile)




module.exports = router