var Room = require('../models/rooms');
var Album = require('../models/album');

module.exports = function(app, passport) {

    // =====================================
    app.get('/', function(req, res) {
      Room.find({}, function(err, rooms){
        if(err) throw err;

        res.render('client/index.ejs', {rooms:rooms});
      })
    });

    app.get('/vacant', function(req, res){
      Room.find({}, function(err, rooms){
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

         var cat = "";
         for(i=0; i<room.length; i++){
           cat = room[i].category;
         }

        Album.find({"room":req.params.id}, function(err, album){
          if(err) return err;

           Room.find({"category":cat}, function(err, cat){
             if(err) return err;

             console.log(cat);
             res.render("client/room.ejs", {room:room, album:album, cat:cat});
           })

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
