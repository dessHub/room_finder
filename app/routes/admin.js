var base64url = require('base64url');
var multer = require('multer');
var fs = require('fs');
var pictures = multer({});
var Room = require('../models/rooms');
var Album = require('../models/album');

var mongoose = require('mongoose');

var upload = multer({ dest: 'uploads/' });

module.exports = function(app, passport) {

    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {

      console.log(req.user);
        res.render('admin/index.ejs', {
            user : req.user // get the user out of session and pass to template

        });
    });

    // =====================================
    app.get('/admin-vacant', isLoggedIn, function(req, res) {

      Room.find({"status":"Vacant"}, function(err, rooms){
        if(err) return err;

        res.render('admin/rooms.ejs', {rooms:rooms}); // load the index.ejs file
      })

    });

    // =====================================
    app.get('/admin-tobe', isLoggedIn, function(req, res) {
      Room.find({"status":"To Be Vacant"}, function(err, rooms){
        if(err) return err;

        res.render('admin/rooms.ejs', {rooms:rooms}); // load the index.ejs file
      })
    });

    // =====================================
    app.get('/admin-occupied', isLoggedIn, function(req, res) {
      Room.find({"status":"Occupied"}, function(err, rooms){
        if(err) return err;

        res.render('admin/rooms.ejs', {rooms:rooms}); // load the index.ejs file
      })
    });

    // =====================================
    app.get('/admin-all', isLoggedIn, function(req, res) {
      Room.find({}, function(err, rooms){
        if(err) return err;

        res.render('admin/rooms.ejs', {rooms:rooms}); // load the index.ejs file
      })
    });

    // =====================================
    app.get('/admin-add', isLoggedIn, function(req, res) {
        res.render('admin/add.ejs', {}); // load the index.ejs file
    });

    app.post('/add', upload.single('image'), function(req, res){
      var location = req.body.location;
      var title = req.body.title;
      var category = req.body.category;
      var info = req.body.info;
      var price = req.body.price;
      var user = req.user;
      var status = "Pending";
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

           var room = new Room();
             room.category = category;
             room.title = title;
             room.location = location;
             room.image = target_path;
             room.status = status;
             room.price = price;
             room.info = info;
             room.user = user;
             room.date = Date();
             console.log(room.location);
           room.save(function(err, room){
             if(err) return err;

             var id = room.id;
             console.log(id);
             var lin = "room" + id ;
             console.log("saved")
             req.flash("success_msg", "Your Ad successfully created")
             res.redirect(lin);
           });

    });

    app.get('/room:id', function(req, res){
      Room.find({"_id":req.params.id}, function(err, room){
        if(err) return err;

        Album.find({"room":req.params.id}, function(err, album){
          if(err) return err;

          res.render("client/ad.ejs", {room:room, album:album});
        })

      })
    });

   app.get('/delroom:id', function(req, res){
     Room.remove({"_id":req.params.id},function(err, room){
         if(err) return err;

         console.log("removed");
         res.redirect('/admin-vacant');
       })
   });

   app.get('/delalbum/:id/:alid', function(req, res){

     var room = req.params.id;
     var lin = "room" + room ;
     console.log(lin);
     Album.remove({"_id":req.params.alid},function(err, album){
         if(err) return err;

         console.log("removed");
         res.redirect(lin);
       });
   });

    app.post('/update:id', function(req,res){
      var location = req.body.location;
      var category = req.body.category;
      var title = req.body.title;
      var info = req.body.info;
      var price = req.body.price;
      var status = req.body.status;

      var id = req.params.id;
      var lin = "room" + id ;

      var room = new Room();
      room._id = id;

      room.update({location:location,
        category:category,
        title : title,
        info:info,
        status:status,
        price:price},function(err, room){
        if(err) return err;

        console.log("Success")
        res.redirect(lin)
        delete req.session.returnTo;
      })
    });

    app.post('/image:id', upload.single('image'), function(req, res){
      var id = req.params.id;
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

        var lin = "room" + id ;

         var room = new Room();
         room._id = id;
         room.update({image:target_path}, function(err, room){
           if(err) return err;

           console.log(room);

           req.flash('success_msg', "Profile image uploaded");
           res.redirect(lin);
         })

    });

    app.post('/addimage:id', upload.single('image'), function(req, res){
      var id = req.params.id;
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

      var lin = "room" + id ;
      console.log(lin);

         var album = new Album();
         album.room = id;
         album.image = target_path;

         album.save(function(err, album){
           if(err) return err;

           console.log("success");

           req.flash('success_msg', "Image uploaded");
           res.redirect(lin);
         })

    })

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
