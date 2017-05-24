var base64url = require('base64url');
var multer = require('multer');
var fs = require('fs');
var pictures = multer({});
var Room = require('../models/rooms');
var Album = require('../models/album');
var Product = require('../models/product');
var List = require('../models/list');
var User = require('../models/user');

var mongoose = require('mongoose');

var upload = multer({ dest: 'uploads/' });

module.exports = function(app, passport) {

    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {

       User.find({role:"normal"}, function(err, users){
         if(err) return err;

         Room.find({}, function(err, rooms){
           if(err) return err;

           var room = rooms.length;

           List.find({}, function(err, lists){
             if(err) throw err;

             var list = lists.length;
             var count = users.length;
             res.render('admin/index.ejs', {
                 user : req.user, // get the user out of session and pass to template
                 users : users,
                 count : count,
                 room : room,
                 list : list
             });

           })
         })
       })

    });

    // =====================================
    app.get('/all_ads', isLoggedIn, function(req, res) {

      Room.find({}, function(err, rooms){
        if(err) return err;

        console.log(rooms);
        res.render('admin/rooms.ejs', {rooms:rooms}); // load the ads.ejs file
      })

    });

    // =====================================
    app.get('/pending_ads', isLoggedIn, function(req, res) {
      console.log("hereee");
      Room.find({status:"Pending"}, function(err, rooms){
        if(err) return err;

        res.render('admin/rooms.ejs', {rooms:rooms}); // load the index.ejs file
      })

    });

    // =====================================
    app.get('/live_ads', isLoggedIn, function(req, res) {
      Room.find({status:"Live"}, function(err, rooms){
        if(err) return err;

        res.render('admin/rooms.ejs', {rooms:rooms}); // load the index.ejs file
      })
    });

    // =====================================
    app.get('/list_all', isLoggedIn, function(req, res) {
      List.find({}, function(err, list){
        if(err) return err;

        res.render('admin/listings.ejs', {lists:list}); // load the index.ejs file
      })
    });

    // =====================================
    app.get('/list_pending', isLoggedIn, function(req, res) {
      List.find({status:"Pending"}, function(err, lists){
        if(err) return err;

        res.render('admin/listings.ejs', {lists:lists}); // load the index.ejs file
      })
    });

    // =====================================
    app.get('/list_live', isLoggedIn, function(req, res) {
      List.find({status:"Live"}, function(err, list){
        if(err) return err;

        res.render('admin/listings.ejs', {lists:list}); // load the index.ejs file
      })
    });

    // =====================================
    app.get('/admin-add', isLoggedIn, function(req, res) {
        res.render('admin/add.ejs', {}); // load the index.ejs file
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
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
