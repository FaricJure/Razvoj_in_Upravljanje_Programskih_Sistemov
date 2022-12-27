var commentModel = require('../models/commentModel.js')

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {

    /**
     * commentController.list()
     */
    list: function (req, res) {
        commentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                })
            }
            return res.json(comments)
        })
    },

    /**
     * commentController.show()
     */
    show: function (req, res) {
        var id = req.params.id
        commentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                })
            }
            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                })
            }
            return res.json(comment)
        })
    },

    /**
     * commentController.create()
     */
    create: function (req, res) {
        var comment = new commentModel({
			route : req.body.route,
			user : req.body.user,
			comment : req.body.comment,
        })

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment',
                    error: err
                })
            }
            return res.status(201).json(comment)
        })
    },

    /**
     * commentController.update()
     */
    update: function (req, res) {
        var id = req.params.id
        commentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment',
                    error: err
                })
            }
            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                })
            }

            comment.route = req.body.route ? req.body.route : comment.route
			comment.user = req.body.user ? req.body.user : comment.user
			comment.comment = req.body.comment ? req.body.comment : comment.comment

            comment.save(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment.',
                        error: err
                    })
                }

                return res.json(comment)
            })
        })
    },

    /**
     * commentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id
        commentModel.findByIdAndRemove(id, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the comment.',
                    error: err
                })
            }
            return res.status(204).json()
        })
    },

    /* ============================================================================================== */

    /**
     * commentController.post()
     */
    post: function (req, res, next) {
        var comment = new commentModel({
            route : req.body.route,
            user : req.session.userId,
            comment : req.body.comment
        })

        comment.save(function (err, comment) {
            if (err) {
                err = new Error(err)
                err.status = 401
                return next(err)
            }
            console.log(comment)
            return res.redirect('/route/' + req.body.route)
        })
    },
}
