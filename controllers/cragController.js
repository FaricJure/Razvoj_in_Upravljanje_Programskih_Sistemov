var cragModel = require('../models/cragModel.js')
var dateformat = require('dateformat')
var app = require('../app.js')

/**
 * cragController.js
 *
 * @description :: Server-side logic for managing crags.
 */
module.exports = {

    /**
     * cragController.list()
     */
    list: function (req, res) {
        cragModel.find(function (err, crags) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting crag.',
                    error: err
                })
            }
            return res.json(crags)
        })
    },

    /**
     * cragController.show()
     */
    show: function (req, res) {
        var id = req.params.id
        cragModel.findOne({_id: id}, function (err, crag) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting crag.',
                    error: err
                })
            }
            if (!crag) {
                return res.status(404).json({
                    message: 'No such crag'
                })
            }
            return res.json(crag)
        })
    },

    /**
     * cragController.display()
     */
    display: function(req, res, next) {
        var id = req.params.id
        cragModel.findOne({_id: id}, function (err, crag) {
            if (err) {
                err = new Error(err)
                err.status = 401
                return next(err)
            }
            if (!crag) {
                err = new Error('No such crag')
                err.status = 401
                return next(err)
            }

            require('../models/cragModel.js').findById(crag._id).exec(function(err, crag){
                if(err)
                    return err
                if(!crag)
                    return new Error('No such crag')
                res.render('crag/display', {
                    cragId: crag._id,
                    name: crag.name,
                    description: crag.description.sl,
                    location: crag.location,
                    kid_friendly: crag.kid_friendly,
                    sectors: crag.sectors,
                })
            })
        })
    },

    /**
     * cragController.googlemap()
     */
    map: function(req, res, next) {
        require('../models/cragModel.js').find({}, function(err, crags){
            if (err) {
                var err = new Error(err)
                err.status = 401
                return next(err)
            }
            var c_arr = new Array()
            for(var i =0; i < crags.length; i++){
                l = crags[i].location
                c_arr.push(crags[i]._id)
                c_arr.push(crags[i].name)
                c_arr.push(l.latitude)
                c_arr.push(l.longitude)
            }
            res.render('map', { data: c_arr })
        })
    }
}
