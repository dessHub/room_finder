// set up ======================================================================

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to database

require('./config/passport')(passport); // pass passport for configuration

// set up express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//set static folder.
app.use('/assets', express.static('assets'));


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'thereisnosecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/index.js')(app, passport); // load routes and pass in app and fully configured passport
require('./app/routes/auth.js')(app, passport);
require('./app/routes/admin.js')(app, passport);

// launch ======================================================================
app.listen(port);
console.log('The server runs on port ' + port);
