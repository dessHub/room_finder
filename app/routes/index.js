var Room = require('../models/rooms');
var Album = require('../models/album');

module.exports = function(app, passport) {

    // =====================================
    app.get('/', function(req, res) {
        res.render('client/index.ejs'); // load the index.ejs file
    });

    app.get('/vacant', function(req, res){
      Room.find({"status":"Vacant"}, function(err, rooms){
        if(err) throw err;

        res.render('client/vacant.ejs', {rooms:rooms});
      })

    })

    app.get('/tobe', function(req, res){
      Room.find({"status":"To Be Vacant"}, function(err, rooms){
        if(err) throw err;

        res.render('client/vacant.ejs', {rooms:rooms});
      })
    })

    app.get('/clroom:id', function(req, res){
      Room.find({"_id":req.params.id}, function(err, room){
        if(err) return err;

        Album.find({"room":req.params.id}, function(err, album){
          if(err) return err;

          res.render("client/room.ejs", {room:room, album:album});
        })

      })
    });
    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {

      console.log(req.user);
        res.render('admin/index.ejs', {
            user : req.user // get the user out of session and pass to template

        });
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
