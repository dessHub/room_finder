var User = require('../models/user');
var passport = require('passport');

module.exports = function(app, passport) {
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('admin/login.ejs');
  });

  // process the login form
  app.post('/login', function(req,res, next){
    passport.authenticate('local', function(err,user){
           if(err) return err;
           var message = {};
           if(!user){
             req.flash("error_msg","Wrong Mobile No or Password");
             console.log("Wrong Mobile No or Password")
             res.redirect('/login');
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
      var phoneno=req.body.phoneno;
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
          req.flash("error_msg",utaken);
          res.redirect('/signup');

      }else {

        User.getUserByUsername(phoneno, function(err, user){
      if(err) throw err;
      if(user){
          var errors = "";
          var msg = "";
          var utaken = "Mobile No exists in our system."
            req.flash("error_msg",utaken);
            res.redirect('/signup');
          }else{

              console.log('You have no register errors');
              var newUser=new User({
                name: name,
                email: email,
                phoneno: phoneno,
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
         res.redirect('/profile');
        }
        else if(role == "normal"){

           res.redirect('/');

        }
      });

      //Admin can change roles for users via this route
app.get('/role/:phoneno/:role', function (req, res){
  var role = req.params.role;
    var username = req.params.phoneno;
    console.log(username);
    User.getUserByUsername(username, function(err, user){
      if(err) return err;
      console.log(user);
      if(user){
        if(role == 'admin'){
          user.update({role:role}, function(err, user){
            if(err) return(err)
            res.redirect('/');
          });
        }
      }else{
        res.send("user does not exist");
      }
    });

})



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
