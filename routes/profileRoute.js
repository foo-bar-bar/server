const router = require('express').Router()
const ProfileController = require('../controllers/profile')
const { authentication, authorization } = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const gcs = require('../middlewares/gcs')

router.use(authentication)
router.get('/', ProfileController.findAll)
router.post('/', multer.single('image'), gcs, ProfileController.uploadImage)
router.delete('/:id', authorization, ProfileController.delete)
router.patch('/:id', authorization, multer.single('image'), gcs, ProfileController.updateField)
router.patch('/love/:id', ProfileController.love)

module.exports = router