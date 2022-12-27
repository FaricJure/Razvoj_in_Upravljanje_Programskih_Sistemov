var routeModel = require('../models/routeModel.js')
var dateformat = require('dateformat')
var app = require('../app.js')

/**
 * routeController.js
 *
 * @description :: Server-side logic for managing routes.
 */
module.exports = {

    /**
     * routeController.list()
     */
    list: function (req, res) {
        routeModel.find(function (err, routes) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting route.',
                    error: err
                })
            }
            return res.json(routes)
        })
    },

    /**
     * routeController.show()
     */
    show: function (req, res) {
        var id = req.params.id
        routeModel.findOne({_id: id}, function (err, route) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting route.',
                    error: err
                })
            }
            if (!route) {
                return res.status(404).json({
                    message: 'No such route'
                })
            }
            return res.json(route)
        })
    },

    /**
     * routeController.display()
     */
    display: function(req, res, next) {
        var id = req.params.id
        require('../models/cragModel.js').find({}, function(err, crags){
            var target = null
            for (const crag of crags) {
                for(i = 0; i < crag.sectors.length && !target; i++) {
                    sector = crag.sectors[i]
                    for(j = 0; j < sector.routes.length && !target; j++) {
                        route = sector.routes[j]
                        if (route.route_id == id) {
                            target = [route, sector, crag]
                            break
                        }
                    }
                }
                if(target)
                    break
            }
            if(!target) {
                err = new Error("Unable to find route.")
                err.status = 401
                return next(err)
            }


            require('../models/commentModel.js').find({ route: route.route_id }, function(err, comments){
                if(err)
                    return err

                var userIds = new Array();
                for(let ans of comments)
                    userIds.push(ans.user)

                require('../models/userModel.js').find().where('_id').in(userIds).exec(function(err, users){
                    if(err)
                        return err

                    var commentPairs = new Array()
                    for (var i = 0; i < comments.length; i++) {
                        var usr = null
                        for(var j = 0; j < users.length; j++){
                            if(String(users[j]._id) == String(comments[i].user)) {
                                usr = users[j]
                                break
                            }
                        }
                        if(usr)
                            commentPairs[i] = JSON.parse((JSON.stringify(comments[i]) + JSON.stringify(usr)).replace(/}{/g,","))
                    }

                    res.render('route/display', {
                        routeId: route.route_id,
                        name: route.name,
                        difficulty: route.difficulty,
                        length: route.length,
                        sector: target[1].name,
                        crag: target[2].name,
                        cragId: target[2]._id,
                        comments: commentPairs,
                    })
                })
            })
        })
    },
}
