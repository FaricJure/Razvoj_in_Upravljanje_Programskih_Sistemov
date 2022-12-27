var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var commentSchema = new Schema({
	'route' : String,
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'users'
	},
	'comment' : String,
	'uploaded' : {type: Date, default: Date.now},
})

module.exports = mongoose.model('comment', commentSchema)
