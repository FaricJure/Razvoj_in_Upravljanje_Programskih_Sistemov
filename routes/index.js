var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
    require('../models/cragModel.js').find(function (err, crags) {
            if (err) {
                var err = new Error(err)
                err.status = 401
                return next(err)
            }

        var cragArr = new Array()
        for(var i =0; i < crags.length; i++){
            cragArr.push(JSON.parse((JSON.stringify(crags[i])).replace(/}{/g,",")))
        }
        res.render('index', { crags: cragArr })
    })
})

module.exports = router
