var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema

var userSchema = new Schema({
    'username' : String,
    'email' : String,
    'password' : String,
    'picture' : {type: String, default: null},
})

userSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.')
                err.status = 401
                return callback(err)
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user)
                } else {
                    return callback()
                }
            })
        })
}

userSchema.pre('save', function (next) {
    var user = this
    User.findOne({email: user.email}, function(err, email) {
        if(email) {
            var err = new Error('Uporabnik s podanim elektronskim naslovom že obstaja')
            return next(err)
        }
        else if(err)
            return next(err)
    })
    User.findOne({username: user.username}, function(err, username) {
        if(username) {
            var err = new Error('Uporabnik s podanim uporabniškim imenom že obstaja')
            return next(err)
        }
        else if(err)
            return next(err)
    })

    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err)
        }
        user.password = hash
        next()
    })
})

var User = mongoose.model('users', userSchema)
module.exports = mongoose.model('users', userSchema)
