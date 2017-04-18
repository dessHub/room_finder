var User = require('../models/user');
var passport = require('passport');

module.exports = function(app, passport) {
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('admin/login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', function(req,res, next){
    passport.authenticate('local', function(err,user){
           if(err) return err;
           var message = {"msg":"Wrong Username or Password"};
           if(!user){

             res.render('pages/login.ejs' , {message:message})
           }
           req.login(user, function(err){
             if(err) return err;
             res.redirect(req.session.returnTo || '/use')
             delete req.session.returnTo;


           });

      })(req,res,next);
    });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('admin/signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', function(req, res){
      var name=req.body.name;
      var email=req.body.email;
      var username=req.body.username;
      var phoneno=req.body.phoneno;
      var location=req.body.location;
      var password=req.body.password;
      var password2=req.body.password2;
      var role = "normal"

      //validation
      req.checkBody('password', 'Password should be 8 to 20 characters').len(8, 20);
      req.checkBody('password2','Passwords do not match').equals(req.body.password);

      var errors = req.validationErrors();
      console.log(errors)
      if (errors){
        var err = errors.msg;
        var utaken = errors;

          res.render('pages/signup.ejs', {error : null,messages: utaken});

      }else {

        User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(user){
          var errors = "";
          var msg = "";
          var utaken = "Mobile No exists in our system."

            res.render('pages/signup.ejs', {error : null,messages: utaken});
          }else{

              console.log('You have no register errors');
              var newUser=new User({
                name: name,
                email: email,
                username: username,
                phoneno: phoneno,
                location : location,
                password: password,
                role: role

          });
          User.createUser(newUser,function(err, user){
              if (err) throw err;

              req.login(user, function(err){
                    if(err) return err;
                    console.log('check user');
                    console.log(user.phoneno);
                    res.redirect(req.session.returnTo || '/use')
                    delete req.session.returnTo;

                });
            });

          console.log(newUser)
        }
      });
      }
    });

    app.get('/use', function(req,res){
        var user = req.user;
        var role = user.role;
        console.log(role)
        if(role =="admin"){
         res.redirect('/admin');
        }
        else if(role == "normal"){

           res.redirect('/profile');

        }
      });


  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
