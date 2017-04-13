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

      Room.find({}, function(err, rooms){
        if(err) return err;

        res.render('admin/rooms.ejs', {rooms:rooms}); // load the index.ejs file
      })

    });

    // =====================================
    app.get('/admin-tobe', isLoggedIn, function(req, res) {
        res.render('admin/rooms.ejs'); // load the index.ejs file
    });

    // =====================================
    app.get('/admin-occupied', isLoggedIn, function(req, res) {
        res.render('admin/rooms.ejs'); // load the index.ejs file
    });

    // =====================================
    app.get('/admin-all', isLoggedIn, function(req, res) {
        res.render('admin/rooms.ejs'); // load the index.ejs file
    });

    // =====================================
    app.get('/admin-add', isLoggedIn, function(req, res) {
        res.render('admin/add.ejs', {}); // load the index.ejs file
    });

    app.post('/add', upload.single('image'), function(req, res){
      var location = req.body.location;
      var room_no = req.body.room_no;
      var plot_no = req.body.plot_no;
      var category = req.body.category;
      var info = req.body.info;
      var price = req.body.price;
      var user = req.user;
      var status = "vacant";
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
       console.log("its getting here")
       console.log(user);
       Room.find({"plot_no" : plot_no, "room_no" :room_no}, function(err, room){
         if(err) return err;

         if(room.length >0){
           req.flash("error_msg","Room no already exist in the system");
           res.redirect('/admin-add');
         }else{
           var room = new Room();
             room.room_no = room_no;
             room.category = category;
             room.plot_no = plot_no;
             room.location = location;
             room.image = target_path;
             room.status = status;
             room.price = price;
             room.info = info;
             room.user = user;
             console.log(room.location);
           room.save(function(err, room){
             if(err) return err;

             console.log("saved")
             req.flash("success_msg", "Room successfully created")
             res.redirect('/admin-add');
           });
         }
       })

    });

    app.get('/room:id', function(req, res){
      Room.find({"_id":req.params.id}, function(err, room){
        if(err) return err;

        Album.find({"room":req.params.id}, function(err, album){
          if(err) return err;

          res.render("admin/room.ejs", {room:room, album:album});
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
      var room_no = req.body.room_no;
      var plot_no = req.body.plot_no;
      var category = req.body.category;
      var info = req.body.info;
      var price = req.body.price;

      var id = req.params.id;
      var lin = "room" + id ;

      var room = new Room();
      room._id = id;

      room.update({location:location,
        room_no:room_no,
        plot_no:plot_no,
        category:category,
        info:info,
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
