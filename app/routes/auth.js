var base64url = require('base64url');
var multer = require('multer');
var fs = require('fs');
var pictures = multer({});
var User = require('../models/user');
var Product = require('../models/product');
var passport = require('passport');

var upload = multer({ dest: 'uploads/' });

module.exports = {
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  log: (req, res)=> {

      // render the page and pass in any flash data if it exists
      res.render('admin/login.ejs');
  },

  // process the login form
  login: (req,res, next)=>{
    passport.authenticate('local', function(err,user){
           if(err) return err;
           var message = {};
           if(!user){
             req.flash("error_msg","Wrong Mobile No or Password");
             console.log("Wrong Mobile No or Password")
             res.redirect('/myaccount');
           }
           req.login(user, function(err){
             if(err) return err;
             res.redirect(req.session.returnTo || '/use')
             delete req.session.returnTo;


           });

      })(req,res,next);
    },

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  myaccount: (req, res)=> {

      // render the page and pass in any flash data if it exists
      res.render('client/mybusiness.ejs', { message: req.flash('signupMessage') });
  },

  // show the signup form
  mylist: (req, res)=> {

      Product.find({user:req.user.id}, (err, products)=>{
        if(err) return err;

        // render the page and pass in any flash data if it exists
        res.render('client/client_landing.ejs', {products:products});
      })
  },

  // process the signup form
  create: (req, res)=>{
      var name=req.body.name;
      var email=req.body.email;
      var phoneno=req.body.phoneno;
      var password=req.body.password;
      var password2=req.body.password2;
      var role = "normal"  ;
      var status = "Pending"  ;
      var location = req.body.location;
      var title = req.body.title;
      var category = req.body.category;
      var regNo=req.body.regNo;
      var description = req.body.description;
      var postcode = req.body.postcode;
      var website = req.body.website;
      var image = req.image;
      var tmp_path = req.file.path;

       /** The original name of the uploaded file
           stored in the variable "originalname". **/
       var target_path = 'uploads/' + req.file.originalname;
       /** A better way to copy the uploaded file. **/
       var src = fs.createReadStream(tmp_path);
       var dest = fs.createWriteStream(target_path);
       src.pipe(dest);
       fs.unlink(tmp_path); //deleting the tmp_path

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
                role: role,
                category : category,
                title : title,
                location : location,
                logo : target_path,
                status : status,
                website : website,
                postcode : postcode,
                description : description,
                regNo : regNo,
                description : description

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
    },

    use: (req,res)=>{
        var user = req.user;
        var role = user.role;
        console.log(role)
        if(role =="admin"){
         res.redirect('/profile');
        }
        else if(role == "normal"){

           res.redirect('/mylist');

        }
      },

      //Admin can change roles for users via this route
roles: (req, res)=>{
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

},

  // =====================================
  // LOGOUT ==============================
  // =====================================
  logout: (req, res)=> {
      req.logout();
      res.redirect('/');
  }

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
