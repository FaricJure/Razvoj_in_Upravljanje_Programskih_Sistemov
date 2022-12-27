var express = require('express')
var router = express.Router()
var userController = require('../controllers/userController.js')
var multer = require('multer')
var upload = multer({ dest: 'public/images/' })
var r = require('./requirements.js')

/*
 * GET
 */
router.get('/', userController.list)
router.get('/login', r.requiresLogout, userController.showLogin)
router.get('/register', r.requiresLogout, userController.showRegister)
router.get('/logout', r.requiresLogin, userController.logout)
//router.get('/activity/:id', userController.activity)
router.get('/:id', userController.profile)
//router.get('/api/:id', userController.show)

/*
 * POST
 */
router.post('/login', r.requiresLogout, userController.login)
router.post('/register', r.requiresLogout, userController.register)
router.post('/changeProfilePicture', r.requiresLogin, upload.single('image'), userController.changeProfilePicture)
//router.post('/', userController.create)

/*
 * PUT
 */
//router.put('/:id', userController.update)

/*
 * DELETE
 */
//router.delete('/:id', userController.remove)

module.exports = router
