var express = require('express')
var router = express.Router()
var routeController = require('../controllers/routeController.js')
var r = require('./requirements.js')

/*
 * GET
 */
router.get('/', routeController.list)
router.get('/:id', routeController.display)
router.get('/api/:id', routeController.show)

/*
 * POST
 */
//router.post('/', routeController.create)
// router.post('/post', r.requiresLogin, routeController.post)

/*
 * PUT
 */
// router.put('/:id', routeController.update)

/*
 * DELETE
 */
//router.delete('/:id', routeController.remove)

module.exports = router
