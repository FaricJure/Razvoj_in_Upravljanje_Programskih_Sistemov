/* Imports */
var express = require('express')
var createError = require('http-errors')
var {engine} = require('express-handlebars')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var bcrypt = require('bcrypt')
/* -------------------------------------------------------------- */

/* Database */
var mongoose = require('mongoose')
const addr = 'mongodb://localhost:27017/rups'
mongoose.connect(addr, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))
/* -------------------------------------------------------------- */


/* Routes */
var indexRouter = require('./routes/index')
var userRouter = require('./routes/userRoutes')
var cragRouter = require('./routes/cragRoutes')
var routeRouter = require('./routes/routeRoutes')
var commentRouter = require('./routes/commentRoutes')
/* -------------------------------------------------------------- */


/* MVC */
// setup
var app = module.exports = express()
app.engine('hbs', engine({defaultLayout: 'default', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', './views')

// session
var session = require('express-session')
app.use(session({
    secret: 'session secret',
    resave: true,
    saveUninitialized: false,
    userPicture: false
}))
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// settings
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/crag', cragRouter)
app.use('/route', routeRouter)
app.use('/comment', commentRouter)

// handlers
app.use(function(req, res, next) {
    next(createError(404))
})

app.use(function(err, req, res, next) {
    console.log(err.message)
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error')
})

session.userPicture

var server = app.listen(process.env.PORT || 3000, () => {
    console.log('Server is started on localhost:'+ (process.env.PORT || 3000))
})


/* -------------------------------------------------------------- */
