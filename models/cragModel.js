var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var cragSchema = new Schema({
    'name' : String,
    'description': {
        'en': String,
        'sl': String
    },
    'location' : {
        'altitude': Number,
        'latitude': Number,
        'longitude': Number,
    },
    'kid_friendly' : Boolean,
    'sectors': Array,
})

module.exports = mongoose.model('crag', cragSchema)
