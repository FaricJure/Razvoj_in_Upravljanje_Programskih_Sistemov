var userModel = require('../models/userModel.js')
var bcrypt = require('bcrypt')
var fs = require('fs')

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    /**
     * userController.list()
     */
    list: function (req, res) {
        userModel.find(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                })
            }
            return res.json(user)
        })
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                }) }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                })
            }
            return res.json(user)
        })
    },

    /**
     * userController.create()
     */
    create: function (req, res, next) {
        if(req.body.password != req.body.repeatPassword) {
            return res.status(500).json({
                message: 'Gesli se ne ujemata',
                error: err
            })
        }
        var user = new userModel({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            picture : null,
        })

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                })
            }
            return res.status(201).json(user)
        })
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                })
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                })
            }

            user.username = req.body.username ? req.body.username : user.username
            user.email = req.body.email ? req.body.email : user.email
            user.password = req.body.password ? req.body.password : user.password
            user.picture = req.body.picture ? req.body.picture : user.picture

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    })
                }

                return res.json(user)
            })
        })
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id
        userModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                })
            }
            return res.status(204).json()
        })
    },

    /* ============================================================================================== */

    /**
     * userController.login()
     */
    showLogin: function(req, res) {
        res.render('user/login', {
            active: { login : true }
        })
    },

    login: function (req, res, next) {
        userModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong username or password.')
                err.status = 401
                return next(err)
            } else {
                req.session.userId = user._id
                req.session.userPicture = user.picture
                return res.redirect(user._id)
            }
        })
    },

    /**
     * userController.logout()
     */
    logout: function (req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    return next(err)
                } else {
                    return res.redirect('/')
                }
            })
        }
    },

    /**
     * userController.register()
     */
    showRegister: function(req, res) {
        res.render('user/register', {
            active: { register : true }
        })
    },

    register: function (req, res, next) {
        if(req.body.password != req.body.repeatPassword) {
            var err = new Error('Gesli se ne ujemata')
            err.status = 401
            return next(err)
        }

        var user = new userModel({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            picture : null,
        })

        user.save(function (err, user) {
            console.log(err)
            if (err) {
                err = new Error(err)
                err.status = 401
                return next(err)
            }
            return res.redirect('/user/login')
        })
    },
    /**
     * userController.profile()
     */

    profile: function (req, res,next) {
        var id = req.params.id
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                err = new Error(err)
                err.status = 401
                return next(err)
            }
            if (!user) {
                err = new Error("User not found")
                err.status = 401
                return next(err)
            }


            require('../models/commentModel.js').find({ user: user._id}, function(err, comments){
                if(err)
                    return err

                console.log(comments)
                res.render('user/profile', {
                    canEdit: user._id == req.session.userId,
                    userId: user._id,
                    email: user.email,
                    username: user.username,
                    picture: user.picture,
                    comments: comments.length,
                })
            })
        })
    },

    /**
     * userController.changeProfilePicture()
     */
    changeProfilePicture: function(req, res, next) {
        if(req.body.targetId != req.session.userId){
            var err = new Error("Unauthorized changeProfilePicture request")
            err.status = 401
            return next(err)
        }

        if(req.session.userPicture) {
            try {
                fs.unlinkSync('public/images/' + req.session.userPicture)
                console.log("Success")
            } catch(err) {
                var err = new Error("Error deleting previous picture from server")
                err.status = 401
                return next(err)
            }
        }

        userModel.update({ _id: req.session.userId }, {
            picture: req.file.filename }, {}, function(req, res, next){
                if(!res.ok){
                    var err = new Error("Error updating user picture")
                    err.status = 401
                    return next(err)
                }
        })
        req.session.userPicture = req.file.name
        res.redirect('/user/' + req.session.userId)
    },
}
