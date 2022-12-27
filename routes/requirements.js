module.exports= {
    requiresLogin: function (req, res, next) {
        if(req.session && req.session.userId)
            return next()
        else {
            var err = new Error("You must log in to view this page")
            err.status = 401
            return next(err)
        }
    },

    requiresLogout: function (req, res, next) {
        if(req.session.userId) {
            var err = new Error("You must log out to view this page")
            err.status = 401
            return next(err)
        } else
            return next()
    }
}
