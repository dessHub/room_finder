var express = require('express');
var app     = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongostore = require('connect-mongo/es5')(session);
var multer = require('multer');
var fs = require('fs');
var engine = require('ejs-locals');
var dotenv           =  require('dotenv');
var env              =  process.env.NODE_ENV || 'development';

dotenv.load();

var configDB = require('./config/settings');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.getDB(env));

//set static folder.
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + '/assets'));
app.use('/room/', express.static(__dirname + '/assets/'));


//use ejs-localsfor ejs template
app.engine('ejs', engine);
//view engine
app.set('view engine', 'ejs');

//body-parser and cookie-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(morgan('dev'));

//express session
console.log(env);
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: configDB.getSecret(env),
  store : new mongostore({ url : configDB.getDB(env), autoReconnect : true })
}));

//pasport initialize
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//express validator
app.use(expressValidator({
  errorFormatter:function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;
    while(namespace.length){
      formParam += '['+ namespace.shift()+ ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));
//connect-flash
app.use(flash());

//global vars
app.use(function(req, res, next){
  res.locals.success_msg =  req.flash('success_msg');
  res.locals.error_msg =  req.flash('error_msg');
  res.locals.error =  req.flash('error');
  res.locals.user =  req.user;
  res.locals.session = req.session;
  next();
});

//routes middleware
require('./app/routes/index.js')(app, passport);
require('./app/routes/auth.js')(app, passport);
require('./app/routes/admin.js')(app, passport);


app.set('port',(process.env.PORT || 8080));
app.listen(app.get('port'),function(){
  console.log('Running on port '+app.get('port'));
  console.log("connected to mongo ", configDB.getDB(env));
});

module.exports = app;
