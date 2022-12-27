var express = require('express')
var router = express.Router()
var cragController = require('../controllers/cragController.js')
var r = require('./requirements.js')

/*
 * GET
 */
router.get('/', cragController.list)
router.get('/map', cragController.map)
router.get('/:id', cragController.display)
router.get('/api/:id', cragController.show)

/*
 * POST
 */
//router.post('/', cragController.create)
// router.post('/post', r.requiresLogin, cragController.post)

/*
 * PUT
 */
// router.put('/:id', cragController.update)

/*
 * DELETE
 */
//router.delete('/:id', cragController.remove)

module.exports = router
