var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var sectorSchema = new Schema({
    'name' : String,
    'routes': Array
})

module.exports = mongoose.model('sector', sectorSchema)
