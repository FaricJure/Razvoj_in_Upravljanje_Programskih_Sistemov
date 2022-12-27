var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var routeSchema = new Schema({
    'route_id': String,
    'name' : String,
    'difficulty': String,
    'length': Number
})

module.exports = mongoose.model('route', routeSchema)
