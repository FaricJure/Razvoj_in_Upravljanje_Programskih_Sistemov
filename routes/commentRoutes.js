var express = require('express')
var router = express.Router()
var commentController = require('../controllers/commentController.js')

/*
 * GET
 */
router.get('/', commentController.list)
//router.get('/:id', commentController.display)
router.get('/api/:id', commentController.show)

/*
 * POST
 */
router.post('/post', commentController.post)
//router.post('/', commentController.create)

/*
 * PUT
 */
router.put('/:id', commentController.update)

/*
 * DELETE
 */
//router.delete('/:id', commentController.remove)

module.exports = router
